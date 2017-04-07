# Linux Freestyle

## Dev Setup

Currently I've only been using the command line to build and
no IDE. If you want to use an IDE that's fine just don't commit
a bunch of random generated build files and add the appropriate
things to the .gitignore file.

On ubuntu make sure to install the javafx libraries and jdk.
`sudo apt-get install openjfx openjdk-8-jdk`

The following Gradle commands should be self explanatory.
Don't check in anything that causes checkstyle errors.

```
gradle checkstyleMain
gradle build
gradle run
```

Also before starting work on something check with Collin
to make sure no one is working on the same thing.
