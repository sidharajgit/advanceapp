<?php
define('_JEXEC', 1);
define('DS', DIRECTORY_SEPARATOR);

$adminDir = str_replace("controlPanel","administrator",__DIR__);
$rootDir = str_replace("controlPanel","",__DIR__);

if (file_exists($adminDir . '/defines.php'))
{
	include_once $adminDir . '/defines.php';
}
if (!defined('_JDEFINES'))
{
	define('JPATH_BASE', $adminDir);
	require_once JPATH_BASE . '/includes/defines.php';
}
require_once JPATH_BASE . '/includes/framework.php';
require_once JPATH_BASE . '/includes/helper.php';
require_once JPATH_BASE . '/includes/toolbar.php';
require_once $rootDir.'/configuration.php';
require_once ( JPATH_BASE. '/includes/defines.php' );
require_once ( JPATH_BASE. '/includes/framework.php' );
$app = JFactory::getApplication('administrator');
$user = JFactory::getUser();
//print_r($user);
$session = &JSession::getInstance();
$sessionId = $session->getId();


/* if ($user->id==0) 
{
	setcookie("adminType", '', time() - 1, '/');
	setcookie("isAdminLoggedIn", "false", time() - 1, '/');
	setcookie("groupTypeId", "", time() - 1, '/');
	setcookie("groupType", "", time() - 1, '/');
	setcookie("groupName", "", time() - 1, '/');
}	
		
if($user->group_type_id=="" && $user->roletype==10)
{
	setcookie("adminType", "groupAdmin", 0, '/');
	setcookie("isAdminLoggedIn", "true", 0, '/');
	setcookie("groupTypeId", $groupTypeId, 0, '/');
	setcookie("groupType", "false", 0, '/');
} */

?>
<! doctype>
<html>
    <head>
		<script>
		var siteURL = "<?php echo JUri::root(); ?>";
		var siteAdminURL = "<?php echo JUri::root(); ?>administrator";		
		var isLoggedIn = "";
		var appUrl = "<?php echo "http://".$_SERVER['SERVER_NAME']; ?>/randa/";			
		</script>
        <!--<link href="dest/css/vendor.css" rel="stylesheet"/>-->
        <link href="dest/css/fontStyles.css" rel="stylesheet"/>
		<link href="dest/css/vendorsass.css" rel="stylesheet"/>
		
        <!--<link href="dest/css/appStyles.css" rel="stylesheet"/>-->
        <link href="dest/css/scssStyles.css" rel="stylesheet"/>
        
        <script src="dest/js/vendor.js"></script>
        <script src="dest/js/JsFiles.js"></script>
		
    </head>
    <body ng-app = "advancePublications" ng-controller="advancepublicationsController">
        <!--<button class="btn btn-primary backBtn" ui-sref="mainPage">Go Back</button>-->
        <div ui-view></div>
        <div ui-view="leftPanel" class="col-md-2"></div>
        <div ui-view="contentPanel" class="col-md-10"></div>
        <div layout="row" layout-sm="column" layout-align="space-around" class="spinbg" ng-if="appLoaderCheck">
            <md-progress-circular class="rotatespin" md-mode="indeterminate" layout layout-align="center center"></md-progress-circular>
        </div>
    </body>
</html>