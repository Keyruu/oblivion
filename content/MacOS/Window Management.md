---
title: The best Tiling Window Manager on MacOS? - Aerospace
draft: false
description: After a lot of testing and using yabai, Amethyst and Aerospace. It feels like I'm not missing out compared to Linux.
tags:
  - productivity
  - window-management
  - tiling-window-manager
  - i3
  - macos
  - blog
date: 2024-11-26
---
Everybody has windows and I don't mean the operating system. These things that use CPU and RAM and sometimes crash. These want to be positioned somewhere on your screen, but where and what size?

I never had a problem in the past with how Windows and Ubuntu manage this, but then after I finished my apprenticeship I got a MacBook, and it definitely took some getting used to. Some of the windows are not full screen by default and can't be full sized by a click. No split in half, no dragging it to the top to full size it. Why? Because it's Apple. (I think they fixed this with Sequoia, took them long enough)

So I got introduced to the Mac ecosystem of tools to make the OS less shit and that worked great. I mean I installed like 10 different tools that did a bunch of stuff to make MacOS more usable. One app in particular was very helpful and that's [Rectangle](https://rectangleapp.com/). A free window management app.

This is fine for most people and was for me at the time. Shortcuts and gestures to resize my windows how I like. But after some time I got too deep into the customization/productivity rabbit hole, this happens especially quick if you go onto [r/unixporn](https://reddit.com/r/unixporn) (this is not actual porn). 

All of these people are talking about Tiling Window Managers and I got curious, so I researched a bit and found i3, xmonad and others. I really liked the premise of not having to worry about resizing your windows at all. But there was one problem, I'm not on Linux...

So I began digging and found the big three! [yabai](https://github.com/koekeishiya/yabai), [Amethyst](https://ianyh.com/amethyst/) and [AeroSpace](https://github.com/nikitabobko/AeroSpace).

But first I wanna talk about what I want to achieve with this. 
 - I want my windows to be automatically tiled, either always in full screen or side by side. 
 - I want to be able to navigate between windows and screens and the mouse should move with the focus. 
 - I want an indicator in which space I am.
 - I want to be able to also resize a window even with the tiling enabled.
 - I want certain apps automatically on certain spaces.
 - And I want it to just work. I don't want to hack together a bunch of scripts for my setup just so I can get these, in my eyes, pretty simple features.

# Amethyst
This looked like the easiest to get started and it was. This just a MacOS app and has sensible defaults for everything. Worked quite well but isn't that extendable. Sending windows to other screens didn't work for me at the time and the mouse moving to the focused window and I couldn't assign certain apps to certain spaces. So I switched relatively quickly to yabai.

# yabai
This is definitely the most popular tiling window manager on MacOS and probably also the most feature complete. Let's get into the biggest caveat right from the start. For every feature to work you have to disable SIP, the System Integrity Protocol of Apple. This was a big nono for me, not only because of the security implications but also because my work wouldn't allow this (for obvious reasons). 

This doesn't mean you can't use yabai without that, you totally can, but some stuff might not work or won't work as intended. For example space creation and deletion doesn't work. No big deal for me. 

I tried it out for a few months and after some time I had 7 scripts to do the stuff I wanted to do. Like sending an app to a space and switching the focus there, because you need SIP disabled for that to work natively. Or focusing a space... yeah you can't navigate to the space with yabai either (with SIP enabled), so you have to assign Hotkeys to the spaces or focus a yabai window in there. 

Or sending all the apps to the correct space, even though yabai has the feature of rules to send apps to specific spaces. SIP strikes again. Yabai only can enforce the rules for windows created while yabai was running. So it shouldn't be a problem after the first installation because it will run all the time after that? Unfortunately no.

And this is what put me over the edge. Yabai constantly looses track of windows and needs a restart. Most often when you plug in or unplug a monitor, which I do quite often with a laptop. I had a script to restart yabai and send all my apps to the dedicated spaces. This was assigned to a hotkey of course, but this was still a pain in the butt.

This isn't really the fault of yabai and more a limitation of MacOS, but still sucks.

There are a bunch of community scripts and utilities to work with yabai which is great, but it does take a bunch of configuration effort. For example there is sketchybar which is pretty awesome to show information that you want in the status bar. This has the caveat that you don't get the native bar anymore, or you have both which looks awful. Without the native bar I don't have some of the app options I need and [Ice](https://github.com/jordanbaird/Ice)'s extra icon bar won't work with a hidden MacOS bar.

# AeroSpace
So I finally arrived at AeroSpace. On paper, it sounds weird that it uses virtual spaces and just puts the windows barely out of view. You can see a sliver of the windows in an edge of the viewport, but solves all the stupid SIP issues.

It just works. Really. I have no scripts, just the configuration file. Focusing spaces works, sending the apps to the spaces works and connecting monitors doesn't make AeroSpace break a sweat.

A nice bonus is the space indicator in the native MacOS bar, that also shows the mode I'm in. You are asking me what a mode is? This is part of the shortcut capability of AeroSpace, which is another huge feature and awesome addition to the window manager. 

Yabai recommends to use skhd in parallel for hotkeys. This does work quite well and also has nice features, but there is the option for a mode in skhd, where I can press a hotkey and then have other hotkeys at my fingertips as long as I'm in that mode. The problem with that there is no real indicator for that. Of course you can use sketchybar to show this but then you have the problem I mentioned already.

AeroSpace has this hotkey functionality just built-in and shows an indicator for the mode you are in.

It has everything I want out of a tiling window manager, and it just works. I know I'm repeating myself, but this is the biggest advantage. I want this to be reliable because it is probably the program I interact the most.

# Closing remarks
I know this is way easier and probably better implemented in Linux, so please don't make fun of me for using MacOS 😭. You can look at my Aerospace config in my shinyflakes repo [here](https://github.com/Keyruu/shinyflakes/blob/main/home/aerospace.nix). 