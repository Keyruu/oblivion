---
title: How I use Raycast to boost my productivity
description: Raycast is an awesome Spotlight replacement and I couldn't work without it. Calendar Events, App switching, Window Management, Extensions and much more.
tags:
  - productivity
  - macos
  - raycast
  - blog
draft:
---
When I switched to MacOS it really was something different. Coming from Windows I didn't feel at home but I was open to adjust my workflow to fit MacOS best.

First thing my colleagues showed me was Spotlight. This is basically an app launcher and search tool on your OS. But it also has some neat little features like calculating in the search bar or searching the web. This is kind of nice but a huge difference to the search on windows.

Then I discovered Raycast and was immediately hooked on it. This has more built in tools and actual integrations with other apps. Jira is a good example for this. You can look at your assigned tickets, create tickets, change the status of tickets and a lot more. And that right at your fingertips. 

But that is not all the biggest strength of Raycast is the extension system and with that the community. There are so many extensions for every application or task I wanna do. And if there isn't one I can easily write my own commands or a whole extension.

So let's get into how I use Raycast to improve my "[[tags/productivity]]".

# General

## Calendar Events
![[calendar-events.png]]
 Raycast basically reads your calendar and parses the events for meeting links. If it finds one you can directly join this from within of Raycast. 
 
This is definitely one of my most used features and of the features that saves me the most amount of clicking.

They even have a camera preview now before you join the meeting which is kind of nice.

## App switching
![[hollow-knight.png]]
This is pretty obvious, but this has a few things about it which makes the app switching especially good and fast. The way MacOS app switching works is that if you have the application not open yet it will open the app, but if there is an instance of that app open it switches the focus to that app. I really like this behaviour

You can of course type in the app you wanna use and Raycast will find it. But you can also assign aliases to apps. For example Firefox could just be `ff`. Then you only type in that, press space and you opened that app. You could also assign a keybind to the app and that completely changed my workflow. Because of the way Mac handles app launch/switch this enables you to navigate to the open app regardless on which space its located.

For my specific setup I use `Alt` + a fitting character for the app. For example `Alt` + `c` for the Arc Browser. (This is because I used Chrome before)

## Extra Actions
![[extra-options.png]]Every element in Raycast has extra actions available to it. For example as seen in the screenshot you can directly uninstall applications with additional data Raycast finds for that application.

This just makes so many interactions available directly from your keyboard. Like quitting an app, show in Finder, configure an app.

## Window Management
![[window-management.png]]
We all know window management sucks on MacOS. You will always have to install one extra app that fixes that problem. I have used Magnet and Rectangle in the past, but Raycast can do the same and has the shortcut presets for both of those apps.

## Floating Notes Window
![[floating-notes-window.png]]
This is a small little window for notes. Just good for temporary stuff I want to edit.

## Other good stuff
In general Raycast has a huge set of features which can replace a lot of other apps.
Some of these include:
- Clipboard Manager
- Snippets (Text Expander)
- File Search
- Quicklinks


# Extensions / Store
![[store.png]]
This really is what makes Raycast so great in my opinion. The community is just awesome. There are so many great extensions that just simplify some of my tasks a lot. 
- Ever needed a password generated? 
- Ever needed something Base64 en/decoded?
- Ever needed to look into a JWT?
- Ever needed a color picker?

And these are just are just a few examples. This really isn't about what Raycast can do that others can't. But more of how do I these things, how fast can I do them, how convenient is it to do. Or how many apps do I have to use to get things done. And with more and more extensions coming out I can replace more and more apps I have on my mac.

I'll list my favorite extensions here but keep in mind that I won't list all of them.
## Password Generator
Pretty obvious what this does, but it really comes in handy. In my job as a DevOps Engineer I create Kubernetes Secrets on the regular. This should be a quick task but still should be secure random password. This extension helps me with that

## Base64
This can encode and decode Base64 strings. This also comes in handy for secrets in Kubernetes because those are always Base64 encoded. And if I quickly wanna add or change a secret this is a real lifesaver.

## JWT
For quickly looking into JWTs I always used https://jwt.io which still is a very cool site. But pasting your "secure" token into a website you don't own just feels wrong. Meet the JWT extension which just looks at the token in your clipboard and let's you search through it.

## Color Picker
I'm also doing design and my own website in my free time and I often need to yoink a color from a website or picture to adjust my color scheme. For this the color picker is just awesome.

## Brew
As a MacOS user the most common package manager is brew. To quickly search which packages or casks are available I use this extension. And that probably daily.

## Change Case
I often need to change Java application.properties into environment variables for my Kubernetes deployments. This does exactly that.

## Coffee
This can keep your Mac awake/caffeinated. F those screensavers.

## Gitmoji
We use Gitmoji as for our commit message format. This enables me to get the proper emoji in any editor or browser.

## Google Translate
Yeah I don't need to explain this.

## Installed Extensions
This lists the installed extensions of Raycast. Especially helpful if you wanna write about what Raycast extensions you use.

## Port Manager
Ever had some weird app/process blocking a specific port? This lists them and you can kill them directly from within Raycast.

## Quick Calendar
I always need to check what date is what day of the week.

## ScreenOCR
Ever needed to get the text of a screenshot?

## Single Disk Eject
Raycast can only eject all disks but not a single one. This extension fixes that. Very nice for backup disks.

## Toothpick
Easily disconnect/connect bluetooth devices.

## Word Search
English isn't my first language and this helps me spell things.

## Others
In general just look into the store and see what could be of use.
https://www.raycast.com/store

## Custom Scripts
You can also extend Raycast with simple scripts. Especially for stuff that needs arguments.

# Closing Words
I hope you can kind of understand why I like Raycast so much. I would really miss this if I'd switch to Linux. I know there is rofi but this doesn't have the same community and tools developed around it.