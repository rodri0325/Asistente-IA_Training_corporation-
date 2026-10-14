<?php
/**
 * Plugin Name:       TRAINING Asistente IA
 * Description:       Chat del asistente comercial y académico de TRAINING conectado a su backend.
 * Version:           0.1.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            Equipo del proyecto TRAINING
 * Text Domain:       training-asistente-ia
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TAIA_VERSION', '0.1.0' );
define( 'TAIA_OPTION', 'taia_settings' );

add_action( 'admin_init', 'taia_register_settings' );
add_action( 'admin_menu', 'taia_add_menu' );
add_action( 'wp_enqueue_scripts', 'taia_enqueue_widget' );

/**
 * Return a validated base URL, or an empty string. This is public configuration.
 * HTTP is allowed only for explicit loopback hosts during local development.
 */
function taia_validate_api_url( $value ) {
	if ( ! is_string( $value ) ) {
		return '';
	}

	$value = trim( $value );
	if ( '' === $value || strlen( $value ) > 2048 || false !== strpos( $value, '?' ) || false !== strpos( $value, '#' ) || preg_match( '/[\x00-\x20\x7f<>"\'\\\\]/', $value ) || preg_match( '/%0[ad]/i', $value ) ) {
		return '';
	}

	$parts = wp_parse_url( $value );
	if ( ! is_array( $parts ) || empty( $parts['scheme'] ) || empty( $parts['host'] ) ) {
		return '';
	}
	foreach ( array( 'user', 'pass', 'query', 'fragment' ) as $forbidden ) {
		if ( array_key_exists( $forbidden, $parts ) ) {
			return '';
		}
	}

	$scheme   = strtolower( $parts['scheme'] );
	$host     = strtolower( $parts['host'] );
	$loopback = in_array( $host, array( 'localhost', '127.0.0.1', '[::1]' ), true );
	if ( 'https' !== $scheme && ! ( 'http' === $scheme && $loopback ) ) {
		return '';
	}
	if ( isset( $parts['port'] ) && ( $parts['port'] < 1 || $parts['port'] > 65535 ) ) {
		return '';
	}

	$url = $scheme . '://' . $host;
	if ( isset( $parts['port'] ) ) {
		$url .= ':' . $parts['port'];
	}
	$url .= isset( $parts['path'] ) ? $parts['path'] : '';
	if ( false === filter_var( $url, FILTER_VALIDATE_URL ) ) {
		return '';
	}

	return rtrim( esc_url_raw( $url, array( 'https', 'http' ) ), '/' );
}

function taia_get_settings() {
	$stored = get_option( TAIA_OPTION, array() );
	$stored = is_array( $stored ) ? $stored : array();
	return array(
		'enabled' => isset( $stored['enabled'] ) && in_array( $stored['enabled'], array( 1, '1', true ), true ) ? 1 : 0,
		'api_url' => taia_validate_api_url( isset( $stored['api_url'] ) ? $stored['api_url'] : '' ),
	);
}

function taia_sanitize_settings( $input ) {
	$input   = is_array( $input ) ? $input : array();
	$raw_url = isset( $input['api_url'] ) ? $input['api_url'] : '';
	$url     = taia_validate_api_url( $raw_url );
	$enabled = isset( $input['enabled'] ) && in_array( $input['enabled'], array( 1, '1', true ), true ) ? 1 : 0;

	if ( '' === $url && ( $enabled || ( is_string( $raw_url ) && '' !== trim( $raw_url ) ) || ! is_string( $raw_url ) ) ) {
		add_settings_error(
			TAIA_OPTION,
			'taia_invalid_url',
			__( 'Introduce la URL base del backend con HTTPS, sin usuario, contraseña, parámetros ni fragmentos. Para pruebas locales se permite HTTP solo con localhost, 127.0.0.1 o [::1]. El widget quedó deshabilitado.', 'training-asistente-ia' ),
			'error'
		);
		$enabled = 0;
	}

	return array( 'enabled' => $enabled, 'api_url' => $url );
}

function taia_register_settings() {
	register_setting(
		'taia_group',
		TAIA_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'taia_sanitize_settings',
			'default'           => array( 'enabled' => 0, 'api_url' => '' ),
			'show_in_rest'      => false,
		)
	);
	add_settings_section( 'taia_connection', __( 'Conexión con el asistente', 'training-asistente-ia' ), '__return_false', 'taia-settings' );
	add_settings_field( 'taia_enabled', __( 'Mostrar el chat', 'training-asistente-ia' ), 'taia_render_enabled', 'taia-settings', 'taia_connection' );
	add_settings_field( 'taia_api_url', __( 'URL base del backend', 'training-asistente-ia' ), 'taia_render_api_url', 'taia-settings', 'taia_connection', array( 'label_for' => 'taia_api_url' ) );
}

function taia_add_menu() {
	add_options_page( __( 'Asistente TRAINING', 'training-asistente-ia' ), __( 'Asistente TRAINING', 'training-asistente-ia' ), 'manage_options', 'taia-settings', 'taia_render_settings_page' );
}

function taia_render_enabled() {
	$settings = taia_get_settings();
	?>
	<label for="taia_enabled">
		<input id="taia_enabled" type="checkbox" name="<?php echo esc_attr( TAIA_OPTION ); ?>[enabled]" value="1" <?php checked( 1, $settings['enabled'] ); ?> />
		<?php esc_html_e( 'Activar la burbuja en las páginas públicas', 'training-asistente-ia' ); ?>
	</label>
	<p class="description"><?php esc_html_e( 'Al instalar el plugin, el chat permanece oculto hasta que lo configures y actives aquí.', 'training-asistente-ia' ); ?></p>
	<?php
}

function taia_render_api_url() {
	$settings = taia_get_settings();
	?>
	<input id="taia_api_url" type="url" class="regular-text" name="<?php echo esc_attr( TAIA_OPTION ); ?>[api_url]" value="<?php echo esc_attr( $settings['api_url'] ); ?>" placeholder="https://api.ejemplo.com" maxlength="2048" aria-describedby="taia_api_help" />
	<p id="taia_api_help" class="description"><?php esc_html_e( 'Ejemplo local: http://127.0.0.1:5000. No añadas /chat: el widget lo agrega. Se admite un prefijo como https://ejemplo.com/asistente. Usa HTTPS en un sitio público.', 'training-asistente-ia' ); ?></p>
	<?php
}

function taia_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$site_parts = wp_parse_url( home_url() );
	$site_origin = $site_parts['scheme'] . '://' . $site_parts['host'];
	if ( isset( $site_parts['port'] ) ) {
		$site_origin .= ':' . $site_parts['port'];
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Asistente TRAINING', 'training-asistente-ia' ); ?></h1>
		<p><?php esc_html_e( 'El plugin muestra el chat. El backend de TRAINING debe ejecutarse por separado para responder.', 'training-asistente-ia' ); ?></p>
		<?php settings_errors( TAIA_OPTION ); ?>
		<?php if ( ! is_readable( plugin_dir_path( __FILE__ ) . 'assets/training-chat.js' ) ) : ?>
			<div class="notice notice-error"><p><?php esc_html_e( 'Falta assets/training-chat.js. Instala el ZIP compilado del plugin; la carpeta de código fuente sin compilar no incluye el widget.', 'training-asistente-ia' ); ?></p></div>
		<?php endif; ?>
		<form method="post" action="options.php">
			<?php settings_fields( 'taia_group' ); ?>
			<?php do_settings_sections( 'taia-settings' ); ?>
			<?php submit_button(); ?>
		</form>
		<h2><?php esc_html_e( 'Preparar el backend', 'training-asistente-ia' ); ?></h2>
		<p><?php esc_html_e( 'Añade este origen a ALLOWED_ORIGINS en el .env del backend y reinícialo:', 'training-asistente-ia' ); ?> <code><?php echo esc_html( $site_origin ); ?></code></p>
		<p><?php esc_html_e( 'Si utilizas varios orígenes, sepáralos con comas. No incluyas rutas ni una barra final. localhost y 127.0.0.1 son orígenes distintos.', 'training-asistente-ia' ); ?></p>
		<p><?php esc_html_e( 'La URL del backend será pública. Las claves de Gemini y Meta permanecen exclusivamente en el .env del servidor; nunca se pegan aquí.', 'training-asistente-ia' ); ?></p>
		<p><?php esc_html_e( 'Para un sitio público, configura un backend HTTPS accesible para los visitantes. Una URL local solo funciona en el computador donde se ejecuta ese backend.', 'training-asistente-ia' ); ?></p>
		<p><?php esc_html_e( 'El catálogo actual es de demostración. Valida la oferta real antes de usarlo con clientes.', 'training-asistente-ia' ); ?></p>
	</div>
	<?php
}

function taia_enqueue_widget() {
	$settings = taia_get_settings();
	if ( ! $settings['enabled'] || '' === $settings['api_url'] ) {
		return;
	}
	$file = plugin_dir_path( __FILE__ ) . 'assets/training-chat.js';
	if ( ! is_file( $file ) || ! is_readable( $file ) ) {
		return;
	}

	wp_enqueue_script(
		'taia-widget',
		plugins_url( 'assets/training-chat.js', __FILE__ ),
		array(),
		TAIA_VERSION . '.' . filemtime( $file ),
		array( 'strategy' => 'defer', 'in_footer' => true )
	);
	wp_add_inline_script(
		'taia-widget',
		'window.TrainingChatConfig = ' . wp_json_encode( array( 'apiUrl' => $settings['api_url'] ), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ';',
		'before'
	);
}
