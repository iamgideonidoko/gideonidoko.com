---
title: Building a Customizable Scroll Progress WordPress Plugin
date: 2022-05-08
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/Building%20a%20Customizable%20Scroll%20Progress%20WordPress%20Plugin_gideonidoko.com_46a84a0499.jpg?alt=media&token=3ee3188a-a8b6-4c59-86ec-259f062834dd
description: This article will take you through the steps of building a simple but highly customizable scroll progress WordPress plugin right on your local machine.
tags: [wordpress, plugin, oop, php]
---

Plugins are used to extend the functionality of WordPress -- a popular Content Management System -- by adding new features or modifying the existing behavior. Building a WordPress plugin is most helpful in situations where you need a feature that cannot be provided by an existing plugin on your website. 

This article will take you through the steps of building a simple but highly customizable scroll progress WordPress plugin right on your local machine. This scroll progress plugin will add a progress bar at the top of a web page indicating the user's current scroll level. You'll understand how WordPress plugins work and how to write code that interacts with WordPress by the end of this article.

## Prerequisites

Familiarity with WordPress & Basic knowledge of  JavaScript and Object-Oriented PHP.


## Getting Started

There are two main ways to create WordPress plugins: 

1. By creating a plugin from scratch.
2. By using a plugin development framework or template.

We won't be reinventing the wheel in this article so, we'll use a well built template.

## Installing WordPress

I wrote about [installing WordPress on your local machine here](https://gideonidoko.com/blog/install-wordpress-on-your-local-machine). Quickly go through the article to install WordPress on your machine if you haven't already and come back here when you're done. 

If you already have WordPress installed then continue.

NB: The development tools (PHP, MySQL) used in this article are provided by XAMPP's dev environment.

Open your WordPress installation folder with your favorite code editor. The folder structure should look like this:

![WordPress Folder Structure](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/wordpress-folder-structure_gideonidoko.com_92d7399c3e.PNG?alt=media&token=3eb24db4-e3c2-462e-afc5-dc74be37fdde)

The `wp-content/plugins` directory is the folder of focus in plugin development. This is where all our plugin code will go to. By default, a WordPress installation comes with two plugins, Akismet and Hello Dolly.  A peek into the `plugins` directory will reveal the `akismet` plugin folder for Akismet and the `hello.php` for Hello Dolly.

NB: One rule of thumb is, **Don’t touch WordPress core** so only edit files that pertain to your plugin. The simplest plugin is just a single PHP file like the Hello Dolly plugin.

## Generating a WordPress Plugin Boilerplate

There are lots of boilerplate for plugin development. I recommend [wppb.me](https://wppb.me/) and easy to use generator. It's developed and actively maintained by [Tom McFarlin](https://twitter.com/tommcfarlin) and [Devin Vinson](https://twitter.com/DevinVinson). 

1. Navigate to [wppb.me](https://wppb.me/) in your browser.
2. Fill in the plugin's name, slug, URI, and the author's name, email, and URI as shown below:

![wppb](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/wppb-generator_gideonidoko.com_2cb0fed950.PNG?alt=media&token=d7e20da5-3c42-4cd5-916f-83ce3f690b9b)

Feel free to use your own author information.

3. Click on Build Plugin. This will generate and download a well-documented boilerplate as a zip file.
4. Extract the zip file and copy the `simple-scroll-progress` to the `plugins` directory mentioned earlier.

The folder structure of the boilerplate looks like so:

![plugin structure](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/wp-plugin-structure_gideonidoko.com_b3ef67890b.PNG?alt=media&token=f31b7846-4827-446e-810b-f477554aab74)

The entry point to the plugin is the `simple-scroll-progress.php` file as it has the same name as the plugin's folder but with the `.php` file extension. Also, every plugin entry point file must have a header comment that provides information about the plugin. The boilerplate generator provides this by default.

Open the `simple-scroll-progress.php` and edit the description in the header comment to look like so:

```text

/**
 * @wordpress-plugin
 * Plugin Name:       Simple Scroll Progress
 * Plugin URI:        https://gideonidoko.com/blog/build-a-customizable-scroll-progress-wordpress-plugin
 * Description:       Simple Scroll Progress adds a highly customizable scroll progress plugin to your WordPress site.
 * Version:           1.0.0
 * Author:            Gideon Idoko
 * Author URI:        https://gideonidoko.com/about
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       simple-scroll-progress
 * Domain Path:       /languages
 */
```

Navigate to your plugin page here: [http://localhost/wordpress/wp-admin/plugins.php](http://localhost/wordpress/wp-admin/plugins.php)

![Plugin Page](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/wp-plugin-page_gideonidoko.com_ac60291e5a.PNG?alt=media&token=6c3c8118-bc73-4c01-9f29-77c24c612803)

You can see from the image above that Simple Scroll Progress is installed and activation-ready. Go ahead and activate the plugin.

Now, let's go to the fun part of writing code.

## Enabling Debug Mode

Since we're developing for WordPress and working in a development environment, it is advisable to turn on debugging mode. This will enable WordPress to display errors as they happen. To enable debugging mode, go to the `wp-config.php` file in the root directory of the WordPress installation. Search for the constant `WP_DEBUG` and set its value to `true` as below:

```text
define( 'WP_DEBUG', true );
```



## Plugin helper properties

Let's define some properties that will hold the plugin's unique ID, actual name, prefix, and default options. The unique ID (slug form of the plugin name) is already defined by the boilerplate.

Locate the `simple-scroll-progress/includes/class-simple-scroll-progress.php` file and add the following protected properties to the `Simple_Scroll_Progress` class.

```text
// class-simple-scroll-progress.php

/**
 * Dash separated form of the plugin name (slug)
 */
protected $plugin_name;

/**
 * Plugin Name
 */
protected $actual_name;

/**
 * Underscored separated form of the plugin name
 */
protected $plugin_prefix;

/**
 * Holds an array of customizable options and their default values
 */
protected $plugin_options_default;
```

Update the constructor of the `Simple_Scroll_Progress` class to update the above properties upon class instantiation.

```text
public function __construct() {
    if ( defined( 'SIMPLE_SCROLL_PROGRESS_VERSION' ) ) {
        $this->version = SIMPLE_SCROLL_PROGRESS_VERSION;
    } else {
        $this->version = '1.0.0';
    }
    /**
     * Updated properties
     */
    $this->plugin_name = 'simple-scroll-progress';
    $this->actual_name = 'Simple Scroll Progress';
    $this->plugin_prefix = 'simple_scroll_progress';
    $this->plugin_options_default = array(
        'color' => '#22c1c3',
        'height' => 10,
        'zindex' => 9999999,
        'cap' => 'curve'
    );
    
    // Orchestrates actions  and filters
    $this->load_dependencies();
    // Define internationalization locale
    $this->set_locale();
    // Register all hooks related to the admin area
    $this->define_admin_hooks();
    // Register all hooks related to the public area
    $this->define_public_hooks();
}
```

Add the following methods to the class `Simple_Scroll_Progress` to return the protected helper properties:

```text
public function get_plugin_name() {
    return $this->plugin_name;
}

public function get_actual_name() {
    return $this->actual_name;
}

public function get_plugin_prefix() {
    return $this->plugin_prefix;
}

public function get_options_default() {
    return $this->plugin_options_default;
}
```

Now, pass the above properties in the instantiation of the `Simple_Scroll_Progress_Public` & `Simple_Scroll_Progress_Admin` classes in the `define_public_hooks` & `define_admin_hooks` respectively like so:

```text
private function define_public_hooks() {
    $plugin_public = new Simple_Scroll_Progress_Public( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_prefix(), $this->get_options_default() );
    $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
    $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
}

private function define_admin_hooks() {
    $plugin_admin = new Simple_Scroll_Progress_Admin( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_prefix(), $this->get_options_default(), $this->get_actual_name() );

    $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
    $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
}
```



## Plugin's Sub-level Settings Menu

Settings Menus help to navigate to the different settings pages currently available. To add a sub-level menu for the plugin, we'd first create a method that calls the WordPress `add_submenu_page` function and then we bind the method to the WordPress `admin_menu` hook.

A WordPress hook enables developers to manipulate a procedure without editing any file in the WordPress core.

Locate the `simple-scroll-progress/admin/class-simple-scroll-progress-admin.php` file and add the below methods to the class, `Simple_Scroll_Progress_Admin`.

```text
public function add_sublevel_menu() {
    add_submenu_page(
        'options-general.php', /* parent page file name */
        $this->actual_name.' Settings', /* plugin page name */
        $this->actual_name, /* Menu title */
        'manage_options', /* capability */
        $this->plugin_name, /* plug slug (id) */
        array( $this, 'display_settings_page' ) /* pass display_settings_page as callback */
    );
}
/**
 * Display settings on plugin setting page
 */
public function display_settings_page() {}
```

You can look up the full description of the `add_submenu_page` function [here](https://developer.wordpress.org/reference/functions/add_submenu_page/).

Let's create similar helper properties in the `Simple_Scroll_Progress_Admin` class and update the class' constructor.

```text
private $plugin_name;

private $version; // version of the plugin

private $plugin_prefix;

private $plugin_options_default;

private $actual_name;

public function __construct( $plugin_name, $version, $plugin_prefix, $plugin_options_default, $actual_name ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version; 
    $this->plugin_prefix = $plugin_prefix;
    $this->plugin_options_default = $plugin_options_default;
    $this->actual_name = $actual_name;
}
```

Finally, bind the `add_sublevel_menu` in the `Simple_Scroll_Progress_Admin` to the `admin_menu` admin hook in the `Simple_Scroll_Progress` class. Update the `define_admin_hooks` method like so:

```text
private function define_admin_hooks() {
    $plugin_admin = new Simple_Scroll_Progress_Admin( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_prefix(), $this->get_options_default(), $this->get_actual_name() );

    $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
    $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
    $this->loader->add_action( 'admin_menu', $plugin_admin, 'add_sublevel_menu' );
}
```

**NB**: `$this->loader` is an object of the `Simple_Scroll_Progress_Loader` class which houses the `add_action` method that those the actual work of adding methods to hooks.

Save all files.

Your Settings should have the plugin's name listed as one of the menus.

![Plugin menu](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/plugin-menu_gideonidoko.com_664423139a.PNG?alt=media&token=c1adc5c0-eb09-4525-9f2c-bd1bf15de2cd)



## Creating the Plugin Settings

The plugin settings page going to enable the scroll progress bar's customization of the following:

- color
- height
- zindex
- cap (curve/square)

WordPress has the Settings API that provides functions like register_settings for working with settings.

To create the settings page, we firstly, add a `register_settings` method that registers the setting by calling the `register_setting` function and then add the required section and fields by calling `add_settings_section` and `add_settings_field` respectively. We then add the `register_settings` field to the `admin_init` WordPress admin hook.

In the `Simple_Scroll_Progress_Admin` class, add a `register_settings` method like so:

```text
public function register_settings() {
    
    /**
     register_setting( 
     	string $option_group, 
     	string $option_name, 
     	array $args = array() 
     )
    */
    register_setting(
        $this->plugin_prefix.'_options', // used to store plugin options in the wp database
        $this->plugin_prefix.'_options',
        array(
            'sanitize_callback' => array( $this, 'validate_options' ) // validate_option callback
        )			 
    );
    
    /**
    add_settings_section( 
    	string $id, 
    	string $title, 
    	callable $callback, 
    	string $page 
    )
    */
    add_settings_section(
        'default',
        'Customize Scroll Progress Bar', // default_section_callback
        array($this, ' '), 
        $this->plugin_name
    );

    /**
    add_settings_field( 
    	string $id, 
    	string $title, 
    	callable $callback, 
    	string $page, 
    	string $section = 'default', 
    	array $args = array() 
    )
    */
    add_settings_field(
        'color',
        'Color',
        array($this, 'color_callback'), // color_callback
        $this->plugin_name,
        'default',
        [ 'id' => 'color', 'label' => 'Default: '. $this->plugin_options_default['color'] ]
    );

    add_settings_field(
        'height',
        'Height',
        array($this, 'height_callback'), // height_callback
        $this->plugin_name,
        'default',
        [ 'id' => 'height', 'label' => 'Default: '. $this->plugin_options_default['height'] . ' (px)' ]
    );

    add_settings_field(
        'zindex',
        'Z Index',
        array($this, 'zindex_callback'), zindex_callback
        $this->plugin_name,
        'default',
        [ 'id' => 'zindex', 'label' => 'Default: '. $this->plugin_options_default['zindex'] ]
    );

    add_settings_field(
        'cap',
        'Cap',
        array($this, 'cap_callback'), cap_callback
        $this->plugin_name,
        'default',
        [ 'id' => 'cap', 'label' => 'Default: '. $this->cap_list()[$this->plugin_options_default['cap']] ]
    );

}
```

Now, add the callbacks as methods of the `Simple_Scroll_Progress_Admin` class.

```text
/**
 * called when adding the default section
 */
public function default_section_callback() {}

/**
 * called when adding the color field
 */
public function color_callback($args) {

    $id    = isset( $args['id'] )    ? $args['id']    : '';
    $label = isset( $args['label'] ) ? $args['label'] : '';

    /**
     * get plugin options from the database
     */
    $options = get_option( $this->plugin_prefix.'_options', $this->plugin_options_default );
    $value = isset( $options[$id] ) ? sanitize_text_field( $options[$id] ) : $this->plugin_options_default[$id];

    echo '<input type="color" required id="'. $this->plugin_prefix.'_options_'.$id .'" name="'. $this->plugin_prefix.'_options['.$id .']"
    value="'. $value .'">';
    echo '<br>';
    echo '<label style="margin-top: 0.4rem; display: inline-block;" for="'. $this->plugin_prefix.'_options_'.$id .'">'. $label .'</label>';

}

/**
 * called when adding the height field
 */
public function height_callback($args) {

    $id    = isset( $args['id'] )    ? $args['id']    : '';
    $label = isset( $args['label'] ) ? $args['label'] : '';

    /**
     * get plugin options from the database
     */
    $options = get_option( $this->plugin_prefix.'_options', $this->plugin_options_default );
    $value = isset( $options[$id] ) ? sanitize_text_field( $options[$id] ) : $this->plugin_options_default[$id];

    echo '<input type="number" required min="0" id="'. $this->plugin_prefix.'_options_'.$id .'" name="'. $this->plugin_prefix.'_options['.$id .']"
    value="'. $value .'">';
    echo '<br>';
    echo '<label style="margin-top: 0.4rem; display: inline-block;" for="'. $this->plugin_prefix.'_options_'.$id .'">'. $label .'</label>';

}

/**
 * called when adding the zindex field
 */
public function zindex_callback($args) {


    $id    = isset( $args['id'] )    ? $args['id']    : '';
    $label = isset( $args['label'] ) ? $args['label'] : '';

    /**
     * get plugin options from the database
     */
    $options = get_option( $this->plugin_prefix.'_options', $this->plugin_options_default );
    $value = isset( $options[$id] ) ? sanitize_text_field( $options[$id] ) : $this->plugin_options_default[$id];

    echo '<input type="number" required min="0" id="'. $this->plugin_prefix.'_options_'.$id .'" name="'. $this->plugin_prefix.'_options['.$id .']"
    value="'. $value .'">';
    echo '<br>';
    echo '<label style="margin-top: 0.4rem; display: inline-block;" for="'. $this->plugin_prefix.'_options_'.$id .'">'. $label .'</label>';
}

/**
 * called when adding the cap field
 */
public function cap_callback($args) {

    $id    = isset( $args['id'] )    ? $args['id']    : '';
    $label = isset( $args['label'] ) ? $args['label'] : '';
    
    /**
     * get plugin options from the database
     */
    $options = get_option( $this->plugin_prefix.'_options', $this->plugin_options_default );
    $value = isset( $options[$id] ) ? sanitize_text_field( $options[$id] ) : $this->plugin_options_default[$id];

    $select_options = $this->cap_list();

    echo '<select required type="number" min="0" id="'. $this->plugin_prefix.'_options_'.$id .'" name="'. $this->plugin_prefix.'_options['.$id .']"
    value="'. $value .'">';
    foreach ($select_options as $val => $option) {
        echo '<option value="'. $val .'"'. ($val == $value ? 'selected' : '') .'>'. $option .'</option>';
    }
    echo '</select>';
    echo '<br>';
    echo '<label style="margin-top: 0.4rem; display: inline-block;" for="'. $this->plugin_prefix.'_options_'.$id .'">'. $label .'</label>';

}

public function cap_list() {
    return array(
        'square' => 'Square',
        'curve' => 'Curve'
    );
}

public function validate_options($input) {

    // validate color
    if ( isset($input['color']) ) {
        $input['color'] = sanitize_hex_color($input['color']);
    } else {
        $input['color'] = $this->plugin_options_default['color'];
    }

    // validate height
    if ( isset($input['height']) ) {
        $input['height'] = absint(sanitize_text_field($input['height']));
    } else {
        $input['height'] = $this->plugin_options_default['height'];
    }

    // validate height
    if ( isset($input['zindex']) ) {
        $input['zindex'] = absint(sanitize_text_field($input['zindex']));
    } else {
        $input['zindex'] = $this->plugin_options_default['zindex'];
    }

    // validate height
    if ( isset($input['cap']) ) {
        if ( ! array_key_exists( $input['cap'], $this->cap_list() ) ) {
            $input['cap'] = $this->plugin_options_default['cap'];
        } 
    } else {
        $input['cap'] = $this->plugin_options_default['cap'];
    }

    return $input;

}
```

NB: Data (plugin options) is fetched from the WordPress database using the `get_option` function which is provided by the WordPress Options API.

Now, update the `display_settings_page` method (the callback of the `add_sublevel_menu ` function)

```text
/**
 * Display settings on plugin setting page
 */
public function display_settings_page() {

     // check if user is allowed access
    if ( ! current_user_can( 'manage_options' ) ) return;
    // settings_errors();
    ?>
    <div class="wrap">
        <!-- Page -->
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
        <?php
        // output security fields
        settings_fields( $this->plugin_prefix.'_options' );
        // output setting sections
        do_settings_sections( $this->plugin_name );
        // submit button
        submit_button();
        ?>
        </form>
    </div>
    <?php

}
```



Finally, update the `define_admin_hooks` method of the `Simple_Scroll_Progress` class to bind the `register_settings` method like below:

```text
private function define_admin_hooks() {
	/**
	 * instantiate the Simple_Scroll_Progress_Admin class
	 */
    $plugin_admin = new Simple_Scroll_Progress_Admin( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_prefix(), $this->get_options_default(), $this->get_actual_name() );

    $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
    $this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
    $this->loader->add_action( 'admin_menu', $plugin_admin, 'add_sublevel_menu' );
    $this->loader->add_action( 'admin_init', $plugin_admin, 'register_settings' );

}
```

![Plugin settings page](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/plugin-settings-page_gideonidoko.com_8a9090c0e7.PNG?alt=media&token=63b506fe-5f80-4c25-9975-7ad01149c680)

Now, whenever the Save Changes button is clicked, WordPress stores our values (options) using the group name we register the settings with, in this case, `$this->plugin_prefix.'_options'` (simple_scroll_progress_options). The plugin's options are stored in the `wp_options` table 

## Including the Plugin's JavaScript

Let's write the JavaScript that injects the scroll progress bar to the public-facing part of the WordPress website. Since the JavaScript code is for the pubic-facing part, it should be written in the `simple-scroll-progress-public.js` file.

Locate the `simple-scroll-progress/plugin/js/simple-scroll-progress-public.js` and add the below JavaScript code:

```javascript
function _075a97e0_5a16_4b1f_9288_a4aa951951bfce_(payload) {
	// payload will come from the database

	// check if payload is a valid one 
    // i.e it has all options as key (color, height, zindex, cap)
	if (!typeof payload === 'object' || !payload.hasOwnProperty('color') || !payload.hasOwnProperty('height') || !payload.hasOwnProperty('zindex') || !payload.hasOwnProperty('cap')) return;

	const { color, height, zindex, cap } = payload;
    
   	// check if this function has been called before and cancel execution
    // if true
	if (window._d60589dc_245b_4497_b8f6_a505a85568bf_) return;

	/**
	 * helper function to create a DOM node from an html string
	 */
	function createNodeFromHtmlString(htmlString) {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();
		// return first child node
		return div.firstChild;
	}
    
    // css
	var simple_scroll_progress_css = `
		position: fixed;
		top: 0;
		left: 0;
		height: ${height}px;
		background-color: ${color};
		transition: 0.1s ease width;
		z-index: ${zindex};
		border-top-right-radius: ${cap === 'curve' ? '100rem' : 0};
		border-bottom-right-radius: ${cap === 'curve' ? '100rem' : 0};
	`;
	
    /**
	 * helper function to create a DOM node from an html string
	 */
	var scrollLine = createNodeFromHtmlString(`<div style="${simple_scroll_progress_css}"></div>`);
    
    /**
	 * function to change the scroll progress bar with to the percentage scrolled
	 */
	function fillScrollLine() {
		const windowHeight = window.innerHeight;
		const fullHeight = document.body.clientHeight;
		const scrolled = window.scrollY;
		const percentScrolled = (scrolled / (fullHeight - windowHeight)) * 100;

		scrollLine.style.width = `${percentScrolled}%`;
	}

	/**
	 * helper function to ensure that a certain option is not fired so often
	 */
	function debounce(func, wait = 8, immediate) {
		var timeout;
		return function () {
			var context = this,
				args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
	/**
	 * Listen to the scroll event
	 */
	window.addEventListener('scroll', debounce(fillScrollLine));
	
    /**
	 * inject the scroll progress bar into the page.
	 */
	window.document.body.appendChild(scrollLine);

	// so it doesn't get called twice
	window._d60589dc_245b_4497_b8f6_a505a85568bf_ = true;
}
```

## Passing data from the database to JavaScript code

To pass data from the database to the plugin's JavaScript code, we fetch the data from the database and pass it as an argument to the JavaScript function by calling the JavaScript function in a PHP inline script.

Go to the `class-simple-scroll-progress-public.php` file and in the `Simple_Scroll_Progress_Public` class, update the `enqueue_scripts` method like so:

```text
public function enqueue_scripts() {
    // the get_option function retrieves the plugin data from the database
    /**
    * get_option( string $option, mixed $default = false )
    */
    $options = get_option( $this->plugin_prefix.'_options', $this->plugin_options_default );

    // inject data javascript file.
    /**
    wp_enqueue_script( 
        string $handle, 
        string $src = '', string[] 
        $deps = array(), 
        string|bool|null 
        $ver = false, 
        bool $in_footer = false 
    )
    */
    wp_enqueue_script($this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/simple-scroll-progress-public.js', array(), $this->version, true );
    // inline script to call the js function and pass encoded options from the db
    /**
    wp_add_inline_script( 
        string $handle, 
        string $data, 
        string $position = 'after' 
    )
    */
    wp_add_inline_script($this->plugin_name, "_075a97e0_5a16_4b1f_9288_a4aa951951bfce_(". json_encode($options) .")", 'after');
}
```

This will get all the plugin's options in the database and call the JavaScript that injects the scroll progress bar with it.

Save all files and we are done. You now have for yourself a working plugin.

This is what the plugin and scroll progress bar look like:

![working plugin](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/working-plugin_gideonidoko.com_9a5db002f9.gif?alt=media&token=34dfc0cb-5b2c-4da5-b9e1-6abdaccc4c8c)

## Cleaning Plugin Data on Uninstallation

One best practice is to remove any data that solely belongs to a plugin from the WordPress database upon installation of that plugin. The `uninstall.php` file in the plugin's root directory is run when the plugin is uninstalled.

Let's first define a method that will remove plugin's options.

Add the below method to the `Simple_Scroll_Progress` class.

```text
public function delete_plugin_options() {
    // delete the plugin options
    delete_option( $this->plugin_prefix.'_options' );
}
```

Update the `uninstall.php` file to look like below:

```text
// If uninstall is not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

function simple_scroll_progress_uninstall() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-simple-scroll-progress.php';
	$plugin = new Simple_Scroll_Progress();
	$plugin->delete_plugin_options();
}
simple_scroll_progress_uninstall();
```

And that's a wrap!

You can find the full code for the plugin [here](https://github.com/IamGideonIdoko/simple-scroll-progress).

## Conclusion

Building WordPress plugins can be a bit tasking depending on how complex the functionality of that plugin is. WordPress provides a couple of [APIs](https://developer.wordpress.org/plugins/) that make the work a lot easier.

This article detailed the process of creating a customizable scroll progress WordPress plugin. We learned how to generate a WP plugin boilerplate build with object-oriented PHP. We discussed what the WordPress hook is and Settings and Options API.

## Resources

Explore the following resources to dig deeper into the world of WordPress Plugin Development.

- [Plugin Handbook](https://developer.wordpress.org/plugins/)
- [WordPress Codex](https://codex.wordpress.org/Main_Page)
- [WordPress Code Reference](https://developer.wordpress.org/reference/)

Thanks :)
