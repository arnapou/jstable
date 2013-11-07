<?php
/*
 * This file is part of the Arnapou jsTable package.
 *
 * (c) Arnaud Buathier <arnaud@arnapou.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$pages = array(
	'miscellaneous' => 'Miscellaneous',
	'querying' => 'Querying',
	'reference' => 'Reference',
);

if ( isset($_GET['page']) && in_array($_GET['page'], array_keys($pages), true) ) {
	$current = $_GET['page'];
}
if ( !isset($current) ) {
	foreach ( $pages as $page => $title ) {
		$current = $page;
		break;
	}
}
?><!DOCTYPE html>
<html>
	<head>
		<title>jsTable</title>
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css">
		<link rel="stylesheet" href="style.css">
		<script src="//code.jquery.com/jquery-1.10.1.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
		<script src="script.js"></script>
		<script src="<?= $current ?>.js"></script>
		<script src="../src/jsTable.js"></script>
	</head>
	<body>
		<div class="container">
			<div class="navbar">
				<div class="navbar-inner">
					<a class="brand" href="#">jsTable</a>
					<ul class="nav">
						<?php foreach ( $pages as $page => $title ): ?>
							<li<?= ($current == $page ? ' class="active"' : '') ?>><a href="?page=<?= $page ?>"><?= $title ?></a></li>
						<?php endforeach; ?>
					</ul>
				</div>
			</div>

			<div id="examples"></div>

		</div>
		<script type="text/javascript">
			$(function() {
				show(examples, <?= json_encode($pages[$current]) ?>);
			});
		</script>
	</body>
</html>
