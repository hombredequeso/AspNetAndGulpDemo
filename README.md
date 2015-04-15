# Demo of ASP.NET Webforms and Gulp
This is a basic ASP.NET Webforms application using a Gulp javascript compilation pipeline.

It is intended to show one way that older websites could use gulp, hence taking advantage of the various tools available in the gulp eco-system.

It's primary features are:
* the dev and release versions both use the same minified javascript file. There is essentially no difference between what happens in dev and release.
* front-end development is possible without any use of msbuild, or even visual studio if desired. .aspx and .js viewmodel files can be edited, and without any Visual Studio/msbuild intervention, the results can be tested. All that is required is to run the default gulp task (that would usually be automatically run via a gulp watch task.

## Installation
Nodejs needs to be installed on the machine.

Get the project from github.

Install the required nodejs modules.
```
    AspNetAndGulpDemo>npm install
```
Compile and Run in Visual Studio.

## Usage
The intended scenario in which this style of project could be useful is illustrated via the development process.

* Run the application in Visual Studio.
* Look at:
```
http://localhost:49579/MyDomain/MyCacheBustedPage
```
* It should simply say: "DescriptionSetByViewModelY"

* Browser development tools demonstrate that the file that is delivering the viewmodel is, in fact, a minified javascript file called: myDomain.min.2daa621d.js

* Edit the javascript file called MyPageViewModel.js. (e.g. change DescriptionSetByViewModelY to DescriptionSetByViewModelZ

* In a command line run gulp:
```
    AspNetAndGulpDemo>node_modules\.bin\gulp
```
  or if gulp is globally installed:
```
    AspNetAndGulpDemo>gulp
```

 
* Look at:
```
http://localhost:49579/MyDomain/MyCacheBustedPage
```

* It should now say: "DescriptionSetByViewModelZ"

* Browser development tools will now show that the original myDomain.min.2daa621d.js has been replaced with a new file, different cache-busted checksum in the name, and the new viewmodel in it.




## Making the project
The project was made using the following steps:


* Create a new ASP.NET Webforms project (Visual Studio 2013).
* Add new folder in ‘Scripts’ folder called ‘appBundles’.
* Added new content in MyDomain folder.
* Initialised npm in the root of the website.
```
    d:\dev\prototype\AspNetAndGulpDemo\Webapp>npm init
```
This creates the packages.json file.

* Install gulp
```
    d:\dev\prototype\AspNetAndGulpDemo\Webapp>npm install --save-dev gulp
```
* Create ‘gulpfile.js’ in the Webapp directory.
* Include 'gulpfile.js' in the visual studio project (only necessary if you want visual studio integration)
* If the ‘Task Runner Explorer’ is not installed in Visual Studio ‘Extensions and Updates’, then install it.
* After adding gulpfile.js to the project, restart Visual Studio, right-click on gulpfile.js and go to ‘Task Runner Explorer’. It should show the tasks contained in the gulpfile.js

* Install all the required gulp modules (see modules in packages.json). e.g.:
```
    d:\dev\prototype\AspNetAndGulpDemo\Webapp>npm install --save-dev gulp-concat
```

* Add CacheBuster.cs
* Add appConfig entries to Web.config (DoNotCacheJsFileNameResolver)

* Manually add the following to Webapp.csproj
```
  <ItemGroup>
    <Content Include="Scripts\appBundles\*.min.*.js" />
    <Content Include="Scripts\appBundles\*.min.*.js.map" />
  </ItemGroup>
```

* Run application and look at the two main pages.
http://localhost:49579/MyDomain/MyPage
http://localhost:49579/MyDomain/MyCacheBustedPage

## Karma Javascript Testing
###Karma Infrastructure
```
D:\dev\prototype\AspNetAndGulpDemo\Webapp> npm install karma --save-dev
D:\dev\prototype\AspNetAndGulpDemo\Webapp> npm install karma-jasmine --save-dev
D:\dev\prototype\AspNetAndGulpDemo\Webapp\MyDomain> npm install karma-cli --save-dev
```
###Configuration
```
D:\dev\prototype\AspNetAndGulpDemo\Webapp\MyDomain> ..\node_modules\.bin\karma init karma.conf.js
```
(creates karma.conf.js file)

###Test file
* Added javascript test file: MyPageViewModelSpec.js

###Run Tests
```
D:\dev\prototype\AspNetAndGulpDemo\Webapp\MyDomain> ..\node_modules\.bin\karma start --single-run
```

Or, set them to run continuously, every time a file gets saved:
```
D:\dev\prototype\AspNetAndGulpDemo\Webapp\MyDomain> ..\node_modules\.bin\karma start
```
