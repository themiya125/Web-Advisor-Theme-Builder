<?php
/**
 * Plugin Name: Web Advisor Theme Builder
 * Description: Web Advisor Theme Builder is a powerful custom Gutenberg extension designed to help developers and designers build modern, dynamic WordPress layouts visually. It includes multiple advanced custom blocks such as a Bootstrap-based Hero Slider, Font Awesome Social Media Block, Pop-up Modal Banner, and an Owl Carousel with fully responsive controls. Each block supports flexible customization, inner block nesting, and dynamic styling options — enabling you to create professional page sections, sliders, and modals effortlessly within the block editor.
 *
 * Version: 1.7.7
 * Author: Themiya Jayakodi
 * Author URI: https://themidev.com/
 * Plugin URI: https://github.com/themiya125/Web-Advisor-Theme-Builder
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: web-advisor-theme-builder
 */


if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * License API URL & secret (must match your license-api.php)
 */
define('WAB_LICENSE_API_URL', 'https://api.themidev.com/api/license.php'); 
define('WAB_API_SECRET', 'WEBADVISOR_PRO_2025_SECRET_THEME_BUILDER'); 

/**
 * Enqueue CodeMirror and block editor scripts
 */
function wab_enqueue_code_editor() {
    wp_enqueue_code_editor( [ 'type' => 'text/css' ] );
    wp_enqueue_script( 'wp-theme-plugin-editor' );
    wp_enqueue_style( 'wp-codemirror' );
}
add_action( 'enqueue_block_editor_assets', 'wab_enqueue_code_editor' );

/**
 * ✅ Check if license key is valid
 */
function wab_is_license_valid() {
    $key = get_option('wab_license_key');
    if (empty($key)) return false;

    // call your API
    $response = wp_remote_post(WAB_LICENSE_API_URL, [
        'timeout' => 15,
        'body' => [
            'license_key' => $key,
            'domain' => $_SERVER['SERVER_NAME'],
            'secret' => WAB_API_SECRET,
            'action' => 'validate',
        ],
    ]);

    if (is_wp_error($response)) {
        return false; // network/API error
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    // expected response: {"valid":true, "license_key":"...", "email":"..."}
    if (!empty($body['valid']) && $body['valid'] === true) {
        return true;
    }

    return false;
}

/**
 * ✅ License Settings Page
 */
function wab_license_page_html() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['wab_license_key'])) {
        update_option('wab_license_key', sanitize_text_field($_POST['wab_license_key']));
        echo '<div class="updated"><p>License key saved!</p></div>';
    }

    $license_key = get_option('wab_license_key', '');
    $valid = wab_is_license_valid();

    ?>
    <div class="wrap">
        <h1>Web Advisor Theme Builder - License</h1>
        <form method="post">
            <label for="wab_license_key">Enter License Key:</label><br>
            <input type="text" name="wab_license_key" id="wab_license_key" value="<?php echo esc_attr($license_key); ?>" size="40" />
            <input type="submit" class="button-primary" value="Save Key" />
        </form>

        <div style="margin-top:20px;">
            <?php if ($valid): ?>
                <p style="color:green; font-weight:600;">✅ License Active - Pro features unlocked!</p>
            <?php else: ?>
                <p style="color:#dc3232; font-weight:600;">⚠️ License Inactive - Pro blocks are locked until activation.</p>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

/**
 * ✅ Admin Menu
 */
function wab_add_license_menu() {
    add_menu_page(
        'Web Advisor License',
        'Theme Builder Pro',
        'manage_options',
        'wab-license',
        'wab_license_page_html',
        'dashicons-admin-network',
        80
    );
}
add_action('admin_menu', 'wab_add_license_menu');

/**
 * ✅ Show license status below plugin description (in Plugins list)
 */
add_filter('plugin_row_meta', function($links, $file) {
    if ($file === plugin_basename(__FILE__)) {
        $license_url = admin_url('admin.php?page=wab-license');
        if (wab_is_license_valid()) {
            $links[] = '<span style="color:green; font-weight:600;">✅ License Active</span>';
        } else {
            $links[] = '<span style="color:#dc3232; font-weight:600;">⚠️ License Inactive (<a href="' . esc_url($license_url) . '">Activate</a>)</span>';
        }
    }
    return $links;
}, 10, 2);

/**
 * ✅ Enqueue Gutenberg Editor JS
 */
function wab_enqueue_block_editor_assets() {
    wp_enqueue_script(
        'wab-blocks-editor',
        plugins_url('/build/index.js', __FILE__),
        array(
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-components',
            'wp-i18n',
            'wp-block-editor'
        ),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );

    wp_localize_script('wab-blocks-editor', 'wabProData', array(
        'licenseValid' => wab_is_license_valid()
    ));
}
add_action('enqueue_block_editor_assets', 'wab_enqueue_block_editor_assets');

/**
 * ✅ Enqueue frontend CSS
 */
function wab_enqueue_frontend_styles() {
    if (file_exists(plugin_dir_path(__FILE__) . 'src/style.css')) {
        wp_enqueue_style(
            'wab-blocks-style',
            plugins_url('/src/style.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'src/style.css')
        );
    }
}
add_action('enqueue_block_assets', 'wab_enqueue_frontend_styles');


function web_advisor_enqueue_block_assets() {
    // ✅ Bootstrap CSS & JS
    wp_enqueue_style(
        'web-advisor-bootstrap',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
        array(),
        '5.3.8'
    );

    wp_enqueue_script(
        'web-advisor-bootstrap',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
        array(), // Bootstrap 5 no longer requires jQuery
        '5.3.8',
        true
    );

    // ✅ Font Awesome (load once here for both editor & frontend)
    wp_enqueue_style(
        'web-advisor-fontawesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
        array(),
        '6.7.2'
    );

    // ✅ Bootstrap Icons (add to both editor & frontend)
    wp_enqueue_style(
        'web-advisor-bootstrap-icons',
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
        array(),
        '1.11.3'
    );

    // ✅ Material Icons (load once)
    wp_enqueue_style(
        'web-advisor-material-icons',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        array(),
        null
    );

    // ✅ Owl Carousel
    wp_enqueue_style(
        'owl-carousel',
        'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',
        array(),
        '2.3.4'
    );

    wp_enqueue_style(
        'owl-theme-default',
        'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css',
        array(),
        '2.3.4'
    );

    wp_enqueue_script(
        'owl-carousel',
        'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
        array('jquery'),
        '2.3.4',
        true
    );

    
}
add_action('enqueue_block_assets', 'web_advisor_enqueue_block_assets');

//for fetch dyanmic blocks


function web_advisor_render_latest_blog_posts($attributes) {
    $defaults = [
        'slidesDesktop' => 3,
        'slidesTablet'  => 2,
        'slidesMobile'  => 1,
        'autoplay'      => true,
        'loop'          => true,
        'margin'        => 20,
        'showNav'       => true,
        'showDots'      => true,
        'autoplayTimeout' => 4000,
    ];
    $atts = wp_parse_args($attributes, $defaults);
    $posts = get_posts(['numberposts' => 9, 'post_status' => 'publish']);
    if (!$posts) return '<p>No posts found.</p>';

    ob_start(); ?>

    <div class="owl-carousel wa-latest-carousel"
         data-desktop="<?php echo esc_attr($atts['slidesDesktop']); ?>"
         data-tablet="<?php echo esc_attr($atts['slidesTablet']); ?>"
         data-mobile="<?php echo esc_attr($atts['slidesMobile']); ?>"
         data-autoplay="<?php echo $atts['autoplay'] ? 'true' : 'false'; ?>"
         data-loop="<?php echo (count($posts) > $atts['slidesDesktop'] && $atts['loop']) ? 'true' : 'false'; ?>"
         data-margin="<?php echo esc_attr($atts['margin']); ?>"
         data-show-nav="<?php echo $atts['showNav'] ? 'true' : 'false'; ?>"
         data-show-dots="<?php echo $atts['showDots'] ? 'true' : 'false'; ?>"
         data-autoplay-timeout="<?php echo esc_attr($atts['autoplayTimeout']); ?>">

      <?php foreach ($posts as $post): 
        $thumb = get_the_post_thumbnail_url($post->ID, 'large') ?: 'https://via.placeholder.com/800x500?text=No+Image';
        $excerpt = wp_strip_all_tags(get_the_excerpt($post));
        $excerpt = wp_trim_words($excerpt, 22);
      ?>
        <article class="wa-blog-card">
          <img src="<?php echo esc_url($thumb); ?>" alt="">
          <div class="wa-card-content">
            <?php
            $cats = get_the_category($post->ID);
            if (!empty($cats)) {
              echo '<span class="wa-category">' . esc_html($cats[0]->name) . '</span>';
            }
            ?>
            <div class="wa-meta">
              <span><i class="material-icons">person</i><?php echo esc_html(get_the_author_meta('display_name', $post->post_author)); ?></span>
              <span><i class="material-icons">calendar_month</i><?php echo esc_html(get_the_date('F j, Y', $post)); ?></span>
              <span><i class="material-icons">access_time</i>3 Min Read</span>
              <span><i class="material-icons">comment</i>5 Comments</span>
            </div>
            <h4><?php echo esc_html(get_the_title($post)); ?></h4>
            <p class="excerpt"><?php echo esc_html($excerpt); ?></p>
            <a href="<?php echo esc_url(get_permalink($post)); ?>" class="wa-readmore">
              Read More <i class="material-icons">arrow_forward</i>
            </a>
          </div>
        </article>
      <?php endforeach; ?>
    </div>

    <script>
    jQuery(function($){
      var $carousel = $('.wa-latest-carousel');
      if ($carousel.length && typeof $.fn.owlCarousel === 'function') {
        $carousel.owlCarousel({
          margin: parseInt($carousel.data('margin')),
          loop: $carousel.data('loop'),
          autoplay: $carousel.data('autoplay'),
          autoplayTimeout: parseInt($carousel.data('autoplay-timeout')),
          nav: $carousel.data('show-nav'),
          dots: $carousel.data('show-dots'),
          navText: [
            '<i class="material-icons">chevron_left</i>',
            '<i class="material-icons">chevron_right</i>'
          ],
          responsive:{
            0:{ items: parseInt($carousel.data('mobile')) || 1 },
            600:{ items: parseInt($carousel.data('tablet')) || 2 },
            991:{ items: parseInt($carousel.data('desktop')) || 3 }
          }
        });
      }
    });
    </script>
    <?php
    return ob_get_clean();
}
register_block_type('web-advisor/latest-blog-posts', ['render_callback' => 'web_advisor_render_latest_blog_posts']);


function webadvisor_register_portfolio_cpt() {
    register_post_type('portfolio', [
        'label' => 'Portfolio',
        'public' => true,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => ['title', 'editor', 'thumbnail'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'portfolio'],
        'show_in_rest' => true,
    ]);

    register_taxonomy('portfolio_category', 'portfolio', [
        'label' => 'Portfolio Categories',
        'hierarchical' => true,
        'rewrite' => ['slug' => 'portfolio-category'],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'webadvisor_register_portfolio_cpt');

function webadvisor_portfolio_single_shortcode($atts) {
    global $post;

    // Attributes
    $atts = shortcode_atts([
        'id' => '',
    ], $atts);

    // Detect automatic ID when inside single portfolio
    if (is_singular('portfolio') && empty($atts['id'])) {
        $portfolio_id = get_the_ID();
    } else {
        $portfolio_id = intval($atts['id']);
    }

    if (!$portfolio_id) return '<p>No portfolio item found.</p>';

    $title = get_the_title($portfolio_id);
    $content = apply_filters('the_content', get_post_field('post_content', $portfolio_id));
    $thumbnail = get_the_post_thumbnail($portfolio_id, 'large');
    $terms = wp_get_post_terms($portfolio_id, 'portfolio_category');

    $category_list = '';
    if (!empty($terms)) {
        $category_list = '<div class="wa-portfolio-cats">';
        foreach ($terms as $term) {
            $category_list .= '<span class="wa-cat">' . $term->name . '</span>';
        }
        $category_list .= '</div>';
    }

    ob_start();
    ?>
    <div class="wa-single-portfolio">
        <h1 class="wa-title"><?php echo esc_html($title); ?></h1>

        <div class="wa-thumb">
            <?php echo $thumbnail; ?>
        </div>

        <?php echo $category_list; ?>

        <div class="wa-content">
            <?php echo $content; ?>
        </div>
    </div>
    <?php

    return ob_get_clean();
}
add_shortcode('portfolio_single', 'webadvisor_portfolio_single_shortcode');

function webadvisor_render_portfolio_grid($attributes) {
    // Read attributes
    $showFilters   = $attributes['showFilters'] ?? true;
    $viewMoreLabel = $attributes['viewMoreLabel'] ?? 'View More';
    $viewMoreLink  = $attributes['viewMoreLink'] ?? '/portfolio';

    // Query portfolio posts
    $query = new WP_Query([
        'post_type'      => 'portfolio',
        'posts_per_page' => 6,
    ]);

    ob_start();
    ?>

    <div class="wa-portfolio-block">

        <?php if ($showFilters): ?>
            <div class="wa-portfolio-filters">
                <button class="filter-btn active" data-category="all">All</button>

                <?php
                $categories = get_terms(['taxonomy' => 'portfolio_category']);
                foreach ($categories as $cat):
                ?>
                    <button class="filter-btn" data-category="<?php echo esc_attr($cat->slug); ?>">
                        <?php echo esc_html($cat->name); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div class="wa-portfolio-grid">
            <?php while ($query->have_posts()): $query->the_post(); ?>
                <div class="wa-portfolio-card" data-category="<?php echo esc_attr(wp_get_post_terms(get_the_ID(), 'portfolio_category')[0]->slug ?? ''); ?>">

                    <div class="wa-thumb">
                        <?php the_post_thumbnail('large'); ?>
                        <span class="wa-badge">
                            <?php echo esc_html(wp_get_post_terms(get_the_ID(), 'portfolio_category')[0]->name ?? 'Design'); ?>
                        </span>
                    </div>

                    <h4 class="wa-title"><?php the_title(); ?></h4>

                    <a href="<?php the_permalink(); ?>" class="wa-btn">
                        View Project <span class="material-icons">arrow_forward</span>
                    </a>

                </div>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>

        <div class="wa-loadmore">
            <a href="<?php echo esc_url($viewMoreLink); ?>" class="wa-more-btn">
                <?php echo esc_html($viewMoreLabel); ?>
            </a>
        </div>

    </div>

    <?php
    return ob_get_clean();
}



require plugin_dir_path(__FILE__) . 'plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$wabUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/themiya125/Web-Advisor-Theme-Builder', 
    __FILE__,
    'web-advisor-theme-builder'
);
$wabUpdateChecker->setBranch('main');




