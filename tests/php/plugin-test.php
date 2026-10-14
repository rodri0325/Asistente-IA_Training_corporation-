<?php
/**
 * Contract tests with WordPress function doubles, not a real WordPress runtime.
 * Run: php tests/php/plugin-test.php
 */

define( 'ABSPATH', __DIR__ . '/' );
$taia_test_options = array();
$taia_test_errors = array();
$taia_test_scripts = array();
$taia_test_inline = array();
$taia_test_hooks = array();
$taia_test_registration = array();
$taia_test_deleted = array();
$taia_test_count = 0;
$taia_test_directory = sys_get_temp_dir() . '/taia-contract-' . uniqid( '', true ) . '/';
mkdir( $taia_test_directory . 'assets', 0700, true );

function add_action( $name, $callback ) { $GLOBALS['taia_test_hooks'][ $name ] = $callback; }
function wp_parse_url( $url ) { return parse_url( $url ); }
function esc_url_raw( $url, $protocols = null ) { return $url; }
function __( $text, $domain = null ) { return $text; }
function get_option( $name, $default = false ) { return $GLOBALS['taia_test_options'][ $name ] ?? $default; }
function add_settings_error( $setting, $code, $message, $type ) { $GLOBALS['taia_test_errors'][] = compact( 'setting', 'code', 'message', 'type' ); }
function register_setting( $group, $name, $args ) { $GLOBALS['taia_test_registration'] = compact( 'group', 'name', 'args' ); }
function add_settings_section() {}
function add_settings_field() {}
function plugin_dir_path( $file ) { return $GLOBALS['taia_test_directory']; }
function plugins_url( $asset, $file ) { return 'https://wordpress.example/wp-content/plugins/training-asistente-ia/' . $asset; }
function wp_enqueue_script( $handle, $source, $dependencies, $version, $args ) { $GLOBALS['taia_test_scripts'][] = compact( 'handle', 'source', 'dependencies', 'version', 'args' ); }
function wp_add_inline_script( $handle, $code, $position ) { $GLOBALS['taia_test_inline'][] = compact( 'handle', 'code', 'position' ); }
function wp_json_encode( $value, $flags = 0 ) { return json_encode( $value, $flags ); }
function current_user_can( $capability ) { return false; }
function delete_option( $name ) { $GLOBALS['taia_test_deleted'][] = $name; }

function taia_test_equal( $expected, $actual, $description ) {
	if ( $expected !== $actual ) {
		throw new RuntimeException( $description . ': expected ' . var_export( $expected, true ) . ', got ' . var_export( $actual, true ) );
	}
	++$GLOBALS['taia_test_count'];
}

try {
	require dirname( __DIR__, 2 ) . '/wordpress-plugin/training-asistente-ia.php';
	taia_test_equal( 'taia_register_settings', $taia_test_hooks['admin_init'], 'Settings registered in admin_init' );
	taia_test_equal( 'taia_enqueue_widget', $taia_test_hooks['wp_enqueue_scripts'], 'Only public enqueue hook' );
	taia_register_settings();
	taia_test_equal( 'taia_sanitize_settings', $taia_test_registration['args']['sanitize_callback'], 'Sanitizer is registered' );
	taia_test_equal( false, $taia_test_registration['args']['show_in_rest'], 'Settings not exposed by REST' );
	taia_test_equal( array( 'enabled' => 0, 'api_url' => '' ), taia_get_settings(), 'Disabled by default' );

	$valid = array(
		'https://api.example.com' => 'https://api.example.com',
		'HTTPS://API.EXAMPLE.COM/' => 'https://api.example.com',
		'https://api.example.com:8443/training/v2/' => 'https://api.example.com:8443/training/v2',
		'http://localhost:5000' => 'http://localhost:5000',
		'http://127.0.0.1:5000/prefix/' => 'http://127.0.0.1:5000/prefix',
		'http://[::1]:5000' => 'http://[::1]:5000',
		' https://example.com/base/ ' => 'https://example.com/base',
	);
	foreach ( $valid as $input => $expected ) {
		taia_test_equal( $expected, taia_validate_api_url( $input ), 'Valid URL: ' . $input );
	}

	$invalid = array(
		'', null, array( 'https://example.com' ), true, 5000,
		'http://api.example.com', 'http://192.168.1.10:5000', 'http://localhost.example.com',
		'http://127.1:5000', 'http://2130706433:5000', 'http://localhost.:5000',
		'javascript:alert(1)', '//example.com', 'https:///broken', 'https://',
		'https://user@example.com', 'https://user:pass@example.com',
		'https://example.com?key=secret', 'https://example.com#fragment',
		'https://example.com?', 'https://example.com#',
		'https://example.com/<script>', 'https://example.com/"quoted"',
		"https://example.com/one\ntwo", 'https://example.com/%0d%0aheader',
		'https://example.com\\evil', 'http://localhost:0', 'https://example.com:99999',
	);
	foreach ( $invalid as $input ) {
		taia_test_equal( '', taia_validate_api_url( $input ), 'Reject invalid URL ' . var_export( $input, true ) );
	}

	$result = taia_sanitize_settings( array( 'enabled' => '1', 'api_url' => 'http://public.example' ) );
	taia_test_equal( array( 'enabled' => 0, 'api_url' => '' ), $result, 'Invalid URL disables widget' );
	taia_test_equal( 'taia_invalid_url', $taia_test_errors[0]['code'], 'Invalid URL reports settings error' );
	taia_test_equal( array( 'enabled' => 0, 'api_url' => '' ), taia_sanitize_settings( array( 'enabled' => array( '1' ) ) ), 'Malformed checkbox cannot enable' );
	$result = taia_sanitize_settings( array( 'enabled' => '1', 'api_url' => 'https://api.example.com/prefix/', 'secret' => 'discard-me' ) );
	taia_test_equal( array( 'enabled' => 1, 'api_url' => 'https://api.example.com/prefix' ), $result, 'Only allowed fields saved' );

	taia_enqueue_widget();
	taia_test_equal( 0, count( $taia_test_scripts ), 'Disabled widget enqueues nothing' );
	$taia_test_options[ TAIA_OPTION ] = array( 'enabled' => 1, 'api_url' => 'javascript:alert(1)' );
	taia_enqueue_widget();
	taia_test_equal( 0, count( $taia_test_scripts ), 'Invalid stored URL enqueues nothing' );
	$taia_test_options[ TAIA_OPTION ] = $result;
	taia_enqueue_widget();
	taia_test_equal( 0, count( $taia_test_scripts ), 'Missing asset enqueues nothing' );
	file_put_contents( $taia_test_directory . 'assets/training-chat.js', '/* contract test fixture */' );
	taia_enqueue_widget();
	taia_test_equal( 1, count( $taia_test_scripts ), 'Valid enabled widget enqueues one script' );
	taia_test_equal( array( 'strategy' => 'defer', 'in_footer' => true ), $taia_test_scripts[0]['args'], 'Footer with defer' );
	taia_test_equal( 'taia-widget', $taia_test_inline[0]['handle'], 'Config bound to widget handle' );
	taia_test_equal( 'before', $taia_test_inline[0]['position'], 'Config before widget' );
	$encoded = substr( $taia_test_inline[0]['code'], strlen( 'window.TrainingChatConfig = ' ), -1 );
	taia_test_equal( array( 'apiUrl' => 'https://api.example.com/prefix' ), json_decode( $encoded, true ), 'Public config contains only base URL' );

	ob_start();
	taia_render_settings_page();
	$unauthorized_output = ob_get_clean();
	taia_test_equal( '', $unauthorized_output, 'Unauthorized settings page emits nothing' );
	define( 'WP_UNINSTALL_PLUGIN', true );
	require dirname( __DIR__, 2 ) . '/wordpress-plugin/uninstall.php';
	taia_test_equal( array( 'taia_settings' ), $taia_test_deleted, 'Uninstall deletes only own option' );

	echo 'OK: ' . $taia_test_count . " PHP contract assertions (WordPress doubles; not a real WP integration test).\n";
} finally {
	$asset = $taia_test_directory . 'assets/training-chat.js';
	if ( is_file( $asset ) ) {
		unlink( $asset );
	}
	rmdir( $taia_test_directory . 'assets' );
	rmdir( $taia_test_directory );
}
