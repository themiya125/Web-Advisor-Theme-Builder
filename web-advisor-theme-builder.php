<?php
/**
 * Plugin Name: Web Advisor Theme Builder
 * Description: This plugin provides (Section Block , Div Block, Container Block, Button Block, Home Slider Block)
 * Version: 1.1.0
 * Author: Themiya Jayakodi
 */

if ( ! defined( 'ABSPATH' ) ) exit;

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
 * Enqueue Gutenberg block editor JS
 */
function wab_enqueue_block_editor_assets() {
    wp_enqueue_script(
        'wab-blocks-editor',
        plugins_url( '/build/index.js', __FILE__ ),
        array(
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-components',
            'wp-i18n',
            'wp-block-editor',
            'wp-codemirror'
        ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
    );
}
add_action( 'enqueue_block_editor_assets', 'wab_enqueue_block_editor_assets' );

/**
 * Enqueue frontend CSS
 */
function wab_enqueue_frontend_styles() {
    if ( file_exists( plugin_dir_path(__FILE__) . 'src/style.css' ) ) {
        wp_enqueue_style(
            'wab-blocks-style',
            plugins_url( '/src/style.css', __FILE__ ),
            array(),
            filemtime( plugin_dir_path( __FILE__ ) . 'src/style.css' )
        );
    }
}
add_action( 'enqueue_block_assets', 'wab_enqueue_frontend_styles' );
