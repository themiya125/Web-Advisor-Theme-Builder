<?php
/**
 * Plugin Name: Web Advisor Theme Builder
 * Description: This plugin provides (Section Block , Div Block, Container Block, Button Block, Home Slider Block)
 * Version: 1.4.0
 * Author: Themiya Jayakodi
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * License API URL & secret (must match your license-api.php)
 */
define('WAB_LICENSE_API_URL', 'https://webadvisorlk.com/license-api.php'); 
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
    // Enqueue for both frontend and editor
    wp_enqueue_style(
        'web-advisor-bootstrap',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
        array(),
        '5.3.3'
    );

    wp_enqueue_script(
        'web-advisor-bootstrap',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
        array('jquery'),
        '5.3.3',
        true
    );

    // Material Icons
    wp_enqueue_style(
        'web-advisor-material-icons',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        array(),
        null
    );

    // Font Awesome
    wp_enqueue_style(
        'web-advisor-fontawesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
        array(),
        '6.5.0'
    );
}
add_action('enqueue_block_assets', 'web_advisor_enqueue_block_assets');


/**
 * ✅ Update Checker (GitHub)
 */

require plugin_dir_path(__FILE__) . 'plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$wabUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/themiya125/Web-Advisor-Theme-Builder', 
    __FILE__,
    'web-advisor-theme-builder'
);
$wabUpdateChecker->setBranch('main');




