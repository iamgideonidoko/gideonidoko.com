---
title: Install WordPress on Your Local Machine
date: 2022-08-05
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/Install%20wordpress%20on%20your%20local%20machine_gideonidoko.com_d2686cb48a.jpg?alt=media&token=92717e96-be14-486a-8826-1007c0ee1f8b
description: In this article, you will learn how to install and configure WordPress on your machine for local development purposes. This WordPress installation will mirror the live server environment.
tags: [wordpress, php, setup]
---

WordPress is a popular content management system that can be used for both developing and hosting websites. WordPress is built with PHP and uses MySQL as its database.

In this article, you will learn how to install and configure WordPress on your machine for local development purposes. This WordPress installation will mirror the live server environment.

We need to PHP environment to set up WordPress since it's built with PHP.

### Installing XAMPP

XAMPP is a PHP development environment that provides an Apache distribution containing MariaDB, PHP, and Perl. XAMPP is used in this article. Download the XAMPP for your OS [here](Familiarity with WordPress). Other alternatives to XAMPP are [MAMP](https://www.mamp.info/en/downloads/) and [WAMP](https://www.wampserver.com/en/).

Run the installation file once the download is complete. Open the control panel and start up the MySQL and Apache services as shown below:

![xampp service start](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/xampp-service-start_gideonidoko.com_f2c25f75ad.gif?alt=media&token=7772fd65-a285-4577-ac0e-2d5442807514)

### Downloading WordPress

Go to the [WordPress.org download page](https://wordpress.org/download/) and download WordPress. The WordPress version used in this article is v5.9.3. 

Extract the downloaded file and copy the `wordpress` folder into `[xamp installation directory]/htdocs`. The `htdocs` (Hypertext Documents) directory is the folder that the apache server searches for files and serves. Navigate to `http://localhost/wordpress` to assess the  WordPress.

### Creating a Database for WordPress

WordPress needs a MySQL database to store websites' data. The information of this database is needed during the initial configuration.

To create a database (DB) we need a name for the DB and the collation (set of rules for how the DB engine compares and sorts characters).

Let's create one:

1. Open `phpmyadmin`-- a MySQL Administration tool by opening up `http://localhost/phpmyadmin` in your browser.
2. Click on the **Databases** tab.
3. Enter the **wordpress** for the database name and select `utf8mb4_unicode_ci` as the collation.
4. Click on the **create** button.

![Create wordpress database](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/create-wordpress-database_gideonidoko.com_270fe62ece.gif?alt=media&token=e85d389e-3c56-4620-9a13-2ffbd731428d)

A database called `wordpress` should be created now.

NB: The recommended collation for WordPress is `utf8mb4_unicode_ci` hence selected.

### Configuring WordPress

To configure WordPress, we need the following information:

- Database name: Which will be the `wordpress` DB we just created.
- Database username This is `root` be default.
- Database password: This is blank by default.
- Database host: This is `localhost` by default.
- Table Prefix: This is `wp_` by default.

Navigate to `http://localhost/phpmyadmin` in your browser. 

1. Select your preferred language (Eg. English) and click continue.
2. Click on **Let's go** on the next screen.
3. Enter the database information above and click submit.
4. Click on Run Installation.
5. Enter WordPress website information and click on Install WordPress.
6. Click on Login and login into your newly created website.

![Configure WordPress](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/configure-wordpress_gideonidoko.com_05e531e867.gif?alt=media&token=0eb0a978-b292-4931-8f8e-bb0e12b7dff8)

Congratulation, You've successfully installed WordPress on your local machine.

Thanks for reading🙂
