<?php
/** Presentation theme for the local demonstration; separate from the plugin. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'style', 'script' ) );
} );

add_action( 'wp_enqueue_scripts', function () {
	$directory = get_template_directory();
	wp_enqueue_style( 'training-demo', get_stylesheet_uri(), array(), (string) filemtime( $directory . '/style.css' ) );
	wp_enqueue_script( 'training-demo', get_template_directory_uri() . '/theme.js', array(), (string) filemtime( $directory . '/theme.js' ), array( 'strategy' => 'defer', 'in_footer' => true ) );
}, 20 );

/** The launcher copies the shared catalog here; no second catalog is maintained. */
function training_demo_courses() {
	$file = get_template_directory() . '/catalogo_cursos.json';
	if ( ! is_readable( $file ) ) {
		return array();
	}
	$catalog = json_decode( file_get_contents( $file ), true );
	if ( ! is_array( $catalog ) ) {
		return array();
	}
	$selected = array();
	foreach ( array( 'curso-001', 'curso-002', 'curso-003' ) as $id ) {
		foreach ( $catalog as $course ) {
			if ( is_array( $course ) && isset( $course['id'], $course['nombre'], $course['modalidades'], $course['duracion_semanas'] ) && $id === $course['id'] && is_string( $course['nombre'] ) && is_array( $course['modalidades'] ) && is_numeric( $course['duracion_semanas'] ) ) {
				$selected[] = $course;
				break;
			}
		}
	}
	return $selected;
}
