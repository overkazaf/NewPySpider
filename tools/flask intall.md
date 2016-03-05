
##System-Wide Installation
$ sudo pip install Flask
(On Windows systems, run it in a command-prompt window with administrator privileges, and leave out sudo.)

##pip and distribute on Windows
On Windows, installation of easy_install is a little bit trickier, but still quite easy. The easiest way to do it is to download the distribute_setup.py file and run it. The easiest way to run the file is to open your downloads folder and double-click on the file.

Next, add the easy_install command and other Python scripts to the command search path, by adding your Python installation’s Scripts folder to the PATH environment variable. To do that, right-click on the “Computer” icon on the Desktop or in the Start menu, and choose “Properties”. Then click on “Advanced System settings” (in Windows XP, click on the “Advanced” tab instead). Then click on the “Environment variables” button. Finally, double-click on the “Path” variable in the “System variables” section, and add the path of your Python interpreter’s Scripts folder. Be sure to delimit it from existing values with a semicolon. Assuming you are using Python 2.7 on the default path, add the following value:

PATH:

;C:\Python27;C:\Python27\Scripts

And you are done! To check that it worked, open the Command Prompt and execute easy_install. If you have User Account Control enabled on Windows Vista or Windows 7, it should prompt you for administrator privileges.

Now that you have easy_install, you can use it to install pip:

> easy_install pip