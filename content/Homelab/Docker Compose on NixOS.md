---
id: Docker Compose on NixOS
aliases: 
tags:
  - docker
  - nixos
  - nix
  - homelab
  - docker-compose
  - blog
  - systemd
description: Docker Compose is a great tool for managing multiple containers. It sometimes doesn't play nice with NixOS and I've found a solution for that. This is using systemd services to manage docker composes.
draft: false
title: There is an easy setup for Docker Compose on NixOS
date: 2024-07-23
---
I like NixOS. It's the best Linux experience I ever had because the declarative approach for defining your system is the most maintainable. Read more about what I love about NixOS [[NixOS for Servers|here]].

> Why don't you use Nix without Docker?

Hosting homelab services is a breeze on NixOS. The community just makes awesome modules to use for easy configuration. But not all services that I want to self-host are available on NixOS out of the box and I don't want to develop my own Nix module just to host some random app I found on GitHub. For this reason I'd still like to be able to use docker compose to set up services as I did in the past.

And that is also another argument for docker compose. I'm very familiar with Docker and Compose and have a lot of stacks already set up that I want to use without much migration work. Furthermore, most of the self-hosted stuff has example docker composes for you to just copy and paste.

This does boil down to me being lazy or not knowing Nix that well, but I don't care. :D

> [!info]
> I do wanna say that if a service is directly available in Nix I will use that because configuring them is most of the time easier and packages are also managed by Nix.

# Container Options on NixOS

There are a few options I came across to use containers on NixOS and I can tell why I don't use them.

## [virtualisation.oci-containers](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/oci-containers.nix)

This is a very cool module to define your OCI containers (Docker containers) directly in your Nix config.

The problem with this is no docker network support. I still want to be able to isolate the network from each stack.

The converting of the docker composes would also be a bit of a pain.

## [Arion](https://docs.hercules-ci.com/arion/#_how_it_works)

This is a tool to basically define docker composes inside a nix module. It's a thin wrapper around nix and docker compose.

This looks pretty good but doesn't see much use in the community, and it is another format on top of docker compose which I don't really like.

Maybe I'll use this in the future though.

## What to do then?

The truth is that the 100% Nix approach doesn't work for me here, but I still use Nix to achieve a good setup. Let's get into it.

# Docker Compose as a Systemd service

I will use [Mealie](https://mealie.io/) as the example service I install. Mealie is an awesome self-hosted recipe manager.

So first I use Nix to install Docker like this:

```nix
virtualisation.docker.enable = true;
```

(This one line installs docker. How awesome is this?)

This was the easy part, but how do we get the docker-compose.yaml on the system?

The easiest way to create a file is with the `etc` module. With this you can create folders and files in the `/etc` directory. So what I do for Mealie is this:

```nix
environment.etc."stacks/mealie/compose.yaml".text =
      /* yaml */
      ''
        version: "3.1"
        services:
          mealie:
            container_name: mealie
            image: hkotel/mealie:v0.5.6
            restart: always
            environment:
              PUID: 1000
              PGID: 1000
              TZ: Europe/Berlin
              RECIPE_PUBLIC: "true"
              RECIPE_SHOW_NUTRITION: "true"
              RECIPE_SHOW_ASSETS: "true"
              RECIPE_LANDSCAPE_VIEW: "true"
              RECIPE_DISABLE_COMMENTS: "false"
              RECIPE_DISABLE_AMOUNT: "false"
            volumes:
              - /etc/stacks/mealie/data/:/app/data
      '';
```

Nothing special I know. The cool thing about this is that you can inject variables from Nix into the string here, which can be very powerful.

> [!info]
> Notice the `/* yaml */` this will tell treesitter that the string is in `yaml` format and will do proper syntax highlighting in neovim.

> [!tip]
> You could also have the file content as a separate file if you prefer that approach by doing `.source = ./compose.yaml` instead of `.text`.

Now comes the magic:

```nix
systemd.services.mealie = {
  wantedBy = ["multi-user.target"];
  after = ["docker.service" "docker.socket"];
  path = [pkgs.docker];
  script = ''
 docker compose -f /etc/stacks/mealie/compose.yaml up
  '';
  restartTriggers = [
    config.environment.etc."stacks/mealie/compose.yaml".source
  ];
};
```

Yup that's it. I'll explain the different parts:

- `after`: The service should be started after `docker` and the `docker.socket`
- `path`: This is needed for the systemd service to be able to find the docker executable
- `script`: Starts the docker compose. Notice that this isn't with `-d` because we want the systemd service to be attached to the stacked for log output and restarting
- `restartTriggers`: This will restart the stack if the `compose.yaml` changes

> [!tip]
> A cool addition to this is that you get "health" information and logs out of the box.
>
> If you use [`node_exporter`](https://github.com/prometheus/node_exporter) with the systemd collector enabled you will get the status of all systemd services out of the box. The logs can then be easily be read by [`promtail`](https://grafana.com/docs/loki/latest/send-data/promtail/).

In the full file I also define a variable for the stack directory:

```nix
{pkgs, ...}: let
  dir = "stacks/mealie";
in
  {
    environment.etc."${dir}/compose.yaml".text =
      /*
      yaml
      */
      ''
        version: "3.1"
        services:
          mealie:
            container_name: mealie
            image: hkotel/mealie:v0.5.6
            restart: always
            environment:
              PUID: 1000
              PGID: 1000
              TZ: Europe/Berlin
              RECIPE_PUBLIC: "true"
              RECIPE_SHOW_NUTRITION: "true"
              RECIPE_SHOW_ASSETS: "true"
              RECIPE_LANDSCAPE_VIEW: "true"
              RECIPE_DISABLE_COMMENTS: "false"
              RECIPE_DISABLE_AMOUNT: "false"
            volumes:
              - /etc/${dir}/data/:/app/data
      '';

    systemd.services.mealie = {
      wantedBy = ["multi-user.target"];
      after = ["docker.service" "docker.socket"];
      path = [pkgs.docker];
      script = ''
        docker compose -f /etc/${dir}/compose.yaml up
      '';
      restartTriggers = [
        config.environment.etc."stacks/mealie/compose.yaml".source
      ];
    };
  }
```

Here is a link to my nix repo on GitHub, where you can find the full file: [mealie.nix](https://github.com/Keyruu/shinyflakes/blob/main/hosts/hati/stacks/mealie.nix)

# Closing Words

I'm really happy with this solution. This has a good declarative setup and even has some benefits to it (systemd status and logs). I will definitely shift all my compose setups over to NixOS with this setup and then migrate them directly to Nix if they are available, and I'm not lazy.
