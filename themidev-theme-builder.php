<?php
/**
 * Plugin Name: ThemiDev Theme Builder
 * Description: ThemiDev Theme Builder is a powerful custom Gutenberg extension designed to help developers and designers build modern, dynamic WordPress layouts visually. It includes multiple advanced custom blocks such as a Bootstrap-based Hero Slider, Font Awesome Social Media Block, Pop-up Modal Banner, and an Owl Carousel with fully responsive controls. Each block supports flexible customization, inner block nesting, and dynamic styling options — enabling you to create professional page sections, sliders, and modals effortlessly within the block editor.
 *
 * Version: 1.8.2
 * Author: Themiya Jayakodi
 * Author URI: https://themidev.com/
 * Plugin URI: https://github.com/themiya125/Web-Advisor-Theme-Builder
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: themidev-theme-builder
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Enqueue CodeMirror for Gutenberg
 */
function themidev_enqueue_code_editor() {
    wp_enqueue_code_editor( [ 'type' => 'text/css' ] );
    wp_enqueue_script( 'wp-theme-plugin-editor' );
    wp_enqueue_style( 'wp-codemirror' );
}
add_action( 'enqueue_block_editor_assets', 'themidev_enqueue_code_editor' );

/**
 * Enqueue Gutenberg Editor JS
 */
function themidev_enqueue_block_editor_assets() {
    wp_enqueue_script(
        'themidev-blocks-editor',
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
}
add_action('enqueue_block_editor_assets', 'themidev_enqueue_block_editor_assets');

/**
 * Enqueue frontend CSS
 */
function themidev_enqueue_frontend_styles() {
    if (file_exists(plugin_dir_path(__FILE__) . 'src/style.css')) {
        wp_enqueue_style(
            'themidev-blocks-style',
            plugins_url('/src/style.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'src/style.css')
        );
    }
}
add_action('enqueue_block_assets', 'themidev_enqueue_frontend_styles');

/**
 * Global Assets (Bootstrap, Icons, Owl Carousel)
 */
function themidev_enqueue_block_assets() {

    $base = plugins_url( '/', __FILE__ );

     wp_enqueue_style(
        'themidev-bootstrap',
        $base . 'assets/bootstrap/css/bootstrap.min.css',
        array(),
        '5.3.8'
    );

   wp_enqueue_script(
        'themidev-bootstrap',
        $base . 'assets/bootstrap/js/bootstrap.min.js',
        array(),
        '5.3.8',
        true
    );

   wp_enqueue_style( 'themidev-fontawesome', 
   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css', 
   array(), '6.7.2' );

    wp_enqueue_style(
        'themidev-bootstrap-icons',
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
        array(),
        '1.11.3'
    );

    wp_enqueue_style(
        'themidev-material-icons',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        array(),
        null
    );

      wp_enqueue_style(
        'themidev-owl-carousel',
        $base . 'assets/owl-carousel/owl.carousel.min.css',
        array(),
        '2.3.4'
    );

    wp_enqueue_style(
        'themidev-owl-theme',
        $base . 'assets/owl-carousel/owl.theme.default.min.css',
        array(),
        '2.3.4'
    );

    wp_enqueue_script(
        'themidev-owl-carousel',
        $base . 'assets/owl-carousel/owl.carousel.min.js',
        array('jquery'),
        '2.3.4',
        true
    );
}
add_action('enqueue_block_assets', 'themidev_enqueue_block_assets');

/**
 * Latest Blog Posts Carousel (Dynamic Block)
 */
function themidev_render_latest_blog_posts($attributes) {

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

        <?php foreach ($posts as $post): ?>
            <article class="wa-blog-card">
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($post->ID, 'large') ?: 'https://via.placeholder.com/800x500'); ?>">
                <div class="wa-card-content">
                    <h4><?php echo esc_html(get_the_title($post)); ?></h4>
                    <p><?php echo esc_html(wp_trim_words(get_the_excerpt($post), 22)); ?></p>
                    <a href="<?php echo esc_url(get_permalink($post)); ?>" class="wa-readmore">
                        Read More <span class="material-icons">arrow_forward</span>
                    </a>
                </div>
            </article>
        <?php endforeach; ?>
    </div>

    <?php return ob_get_clean();
}
register_block_type('themidev/latest-blog-posts', [
    'render_callback' => 'themidev_render_latest_blog_posts'
]);


/**
 * Menu Block
 */
function themidev_register_menu_block() {
    register_block_type('themidev/menu-block', [
        'render_callback' => 'themidev_render_menu_block',
    ]);
}
add_action('init', 'themidev_register_menu_block');

function themidev_render_menu_block($attributes) {
    if (empty($attributes['menuId'])) return '';

    return wp_nav_menu([
        'menu' => $attributes['menuId'],
        'container' => 'nav',
        'container_class' => 'themidev-menu align-' . esc_attr($attributes['alignment'] ?? 'center'),
        'echo' => false,
    ]);
}

/**
 * Plugin Update Checker (GitHub)
 */
require plugin_dir_path(__FILE__) . 'plugin-update-checker/plugin-update-checker.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$updateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/themiya125/Web-Advisor-Theme-Builder',
    __FILE__,
    'themidev-theme-builder'
);
$updateChecker->setBranch('main');
