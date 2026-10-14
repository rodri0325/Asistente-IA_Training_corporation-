<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$training_demo_mock = defined( 'TRAINING_DEMO_MODE' ) && TRAINING_DEMO_MODE;
$training_demo_notice = $training_demo_mock ? 'Demostración · respuestas simuladas' : 'Catálogo de ejemplo';
$training_demo_notice_detail = $training_demo_mock
	? 'Demostración con respuestas simuladas y catálogo de ejemplo; no representa una oferta comercial confirmada.'
	: 'El catálogo contiene cursos de ejemplo; no representa una oferta comercial confirmada.';
$training_demo_courses = training_demo_courses();
?>
<!doctype html>
<html lang="es-CO">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'training-site' ); ?>>
<?php wp_body_open(); ?>
<a class="training-skip" href="#contenido">Saltar al contenido</a>
<header class="training-header" id="inicio">
	<div class="training-container training-header-inner">
		<a class="training-brand" href="#inicio" aria-label="TRAINING Corporation, inicio">
			<span class="training-mark" aria-hidden="true"><i></i><i></i><i></i></span>
			<span>TRAINING<small>CORPORATION</small></span>
		</a>
		<nav class="training-nav" aria-label="Navegación principal">
			<a href="#cursos">Cursos</a>
			<a href="#como-consultar">Cómo consultar</a>
		</nav>
		<span class="training-mode" title="<?php echo esc_attr( $training_demo_notice_detail ); ?>" aria-label="<?php echo esc_attr( $training_demo_notice_detail ); ?>"><span aria-hidden="true"></span><?php echo esc_html( $training_demo_notice ); ?></span>
	</div>
</header>

<main id="contenido">
	<section class="training-hero" aria-labelledby="training-hero-title">
		<div class="training-container training-hero-grid">
			<div class="training-hero-copy">
				<p class="training-eyebrow"><span aria-hidden="true"></span>Formación profesional</p>
				<h1 id="training-hero-title">Prepárate para<br><em>lo que sigue.</em></h1>
				<p class="training-intro">Explora nuevas habilidades para tu próximo paso profesional. Encuentra un curso y resuelve tus dudas en una conversación.</p>
				<div class="training-hero-actions">
					<a class="training-button training-button-primary" href="#cursos">Explorar cursos <span aria-hidden="true">↗</span></a>
					<a class="training-text-link" href="#como-consultar">Conoce cómo funciona <span aria-hidden="true">→</span></a>
				</div>
				<p class="training-hero-note">Tecnología, datos y productividad.</p>
			</div>
			<aside class="training-assistant-card" aria-labelledby="training-assistant-title">
				<div class="training-assistant-top">
					<span class="training-assistant-symbol" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M7 5h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H14l-7 5v-5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="1.7"/><path d="M10 12h12M10 17h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span>
					<span>Asistente TRAINING</span>
				</div>
				<h2 id="training-assistant-title">Resuelve tus dudas.</h2>
				<ul class="training-consultation-topics">
					<li><span aria-hidden="true">01</span>Precios y fechas de inicio</li>
					<li><span aria-hidden="true">02</span>Modalidades y duración</li>
					<li><span aria-hidden="true">03</span>Requisitos para comenzar</li>
				</ul>
				<button class="training-button training-button-light" type="button" data-training-chat>Hacer una pregunta <span aria-hidden="true">→</span></button>
			</aside>
		</div>
	</section>

	<section class="training-courses training-container" id="cursos" aria-labelledby="training-courses-title">
		<div class="training-section-heading">
			<div><p class="training-eyebrow">Encuentra tu próximo curso</p><h2 id="training-courses-title">¿Qué quieres aprender?</h2></div>
			<p>Empieza por una habilidad.<br>Consulta los detalles con el asistente.</p>
		</div>
		<div class="training-course-grid">
			<?php foreach ( $training_demo_courses as $training_demo_index => $training_demo_course ) : ?>
				<?php
				$training_demo_modalities = array_filter( $training_demo_course['modalidades'], 'is_string' );
				$training_demo_question = '¿Cuáles son el precio, las modalidades y los requisitos de ' . $training_demo_course['nombre'] . '?';
				?>
				<article class="training-course-card">
					<div class="training-course-top"><span class="training-course-number" aria-hidden="true"><?php echo esc_html( sprintf( '%02d', $training_demo_index + 1 ) ); ?></span><span class="training-duration"><?php echo esc_html( (int) $training_demo_course['duracion_semanas'] ); ?> semanas</span></div>
					<h3><?php echo esc_html( $training_demo_course['nombre'] ); ?></h3>
					<p class="training-course-modality"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="3" width="15" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M7 17h6m-3-4v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><?php echo esc_html( ucfirst( implode( ' · ', $training_demo_modalities ) ) ); ?></p>
					<button class="training-course-button" type="button" data-training-question="<?php echo esc_attr( $training_demo_question ); ?>" aria-label="<?php echo esc_attr( 'Consultar curso: ' . $training_demo_course['nombre'] ); ?>">Consultar curso <span aria-hidden="true">↗</span></button>
				</article>
			<?php endforeach; ?>
			<?php if ( empty( $training_demo_courses ) ) : ?>
				<p>La selección de cursos no está disponible en este momento.</p>
			<?php endif; ?>
		</div>
	</section>

	<section class="training-how" id="como-consultar" aria-labelledby="training-how-title">
		<div class="training-container training-how-grid">
			<div><p class="training-eyebrow">Una conversación para empezar</p><h2 id="training-how-title">Consulta en tres pasos.</h2></div>
			<ol class="training-steps">
				<li><span aria-hidden="true">1</span><div><h3>Elige un curso</h3><p>Explora la selección y abre el curso que te interesa.</p></div></li>
				<li><span aria-hidden="true">2</span><div><h3>Pregunta lo que necesitas</h3><p>Escribe el nombre del curso y tu consulta en el asistente.</p></div></li>
				<li><span aria-hidden="true">3</span><div><h3>Revisa la información</h3><p>Consulta precios, modalidades y requisitos para orientar tu decisión.</p></div></li>
			</ol>
		</div>
	</section>
</main>

<footer class="training-footer">
	<div class="training-container training-footer-inner"><p><strong>TRAINING Corporation</strong><span>Formación profesional</span></p><a href="#inicio">Volver al inicio <span aria-hidden="true">↑</span></a></div>
</footer>
<p class="training-feedback" id="training-feedback" role="status" aria-live="polite" hidden></p>
<?php wp_footer(); ?>
</body>
</html>
