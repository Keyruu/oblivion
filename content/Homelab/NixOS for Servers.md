---
title: Is NixOS the best OS for servers?
description: "Find out if I think that NixOS is the best OS for your servers. Spoiler: Yes I do think that."
tags:
  - nixos
  - nix
  - server
  - homelab
  - blog
draft: false
date: 2024-07-25
---
I first want to tell you my journey with NixOS to better understand where I'm coming from and how it went for me.

# My Journey
![[nixos-learning-curve.png]]
I have been working with Linux on servers (CentOS, Debian) for about 6 years now. I also used it as a desktop environment (Ubuntu) for about 3 years in my apprentice ship. I do know a little bit about it but I am by no means a Linux crack. 

Last year a [friend of mine](https://joinemm.dev/) talked a bunch about NixOS and he started using it for his personal and work computer. I took a look at it and was very confused about everything. This isn't the Linux I know, I thought to myself. After it came up again and again and also was frequently mentioned on the [Self-Hosted Podcast](https://selfhosted.show/) I decided that it's time to take a look into this new world.

I actually wanted to try to migrate our Jenkins agents to be on NixOS and that didn't go well. I looked at how I would get NixOS on Hetzner and was overwhelmed by everything I had to know and do to get that working. So I just immediately went: Nope.

After that I gave NixOS another try on a work computer we had left over. Just to dip my toes and see what the fuzz is all about. And this to wasn't that straight forward. Flashed the ISO on a USB-stick and installed it with the minimum configuration. Now what?

Edited the `configuration.nix` file, rebuilt and see what happened. First thoughts were: Weird file format and I have no clue what all these settings mean. But I powered through until I arrived at an `x11` based system with [`xmonad`](https://xmonad.org/) running. I really liked it so far. I then tried to switch to `Wayland` to try out [`hyprland`](https://hyprland.org/) and that didn't go as planned. Weird issues because of Nvidia drivers, my second monitor would just not work at all. 

> Damn what do I do now? 

Oh yeah I can just rollback to a working version of the system.

This was a big turning point for me in NixOS. At this point I was convinced that I don't want to use other Linux distros anymore.

Half a year later and I'm also convinced that NixOS is the best distro for the server. Let me get into why I think that.

# Why?
## Immutable state of the OS
If the version of the OS with all the packages worked at a certain state and an update messed something up, just rollback to the working version. You can then just spin up another machine with the new version to troubleshoot and then if it works apply the update on the original machine. That is just so incredible.

## One place for your configuration
I don't have to think about how I persist the configuration I did on the system. For example: I setup a backup folder, a crontab, a network change etc. This can be accomplished by Ansible but I can't really rollback a change.

## One language for your configuration
No more `yaml`, `json`, `toml`, `lua`, `.env`, `properties`, etc. This config languages are fine but they do come with some drawbacks.

1. You have to remember `x` different syntaxes
2. No config validation
3. No advanced variables or logic in most of the configs
4. Always have separate files for everything

Nix solves this by being able to cross compile to any format, because it's a programming language.

## Awesome community modules
Ever wanted to setup a monitoring stack, an nginx or a custom systemd service? No problem with NixOS. The modules they provide bring so much functionality and sensible defaults for stuff, it's insane. Just look at the nginx setup:

```nix
{config, ...}: {
  security.acme = {
    acceptTerms = true;
    defaults.email = "my@email.com";
  };

  security.dhparams = {
    enable = true;
    params.nginx = {};
  };

  services.nginx = {
    enable = true;
    recommendedGzipSettings = true;
    recommendedOptimisation = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;
    resolver.addresses = config.networking.nameservers;
    sslDhparam = config.security.dhparams.params.nginx.path;
  };

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  users.users.nginx.extraGroups = [ "acme" ];
}
```

This safes me so many headaches and is so easy to read.

For completeness here is a `nginx.conf` for optimised security:
> [!info]-
> Yoinked this from this [GitHub post](https://gist.github.com/plentz/6737338)
> ```nginx
> # don't send the nginx version number in error pages and Server header
> jserver_tokens off;
> 
> # config to don't allow the browser to render the page inside an frame or iframe
> # and avoid clickjacking http://en.wikipedia.org/wiki/Clickjacking
> # if you need to allow [i]frames, you can use SAMEORIGIN or even set an uri with ALLOW-FROM uri
> # https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options
> add_header X-Frame-Options SAMEORIGIN;
> 
> # when serving user-supplied content, include a X-Content-Type-Options: nosniff header along with the Content-Type: header,
> # to disable content-type sniffing on some browsers.
> # https://www.owasp.org/index.php/List_of_useful_HTTP_headers
> # currently suppoorted in IE > 8 http://blogs.msdn.com/b/ie/archive/2008/09/02/ie8-security-part-vi-beta-2-update.aspx
> # http://msdn.microsoft.com/en-us/library/ie/gg622941(v=vs.85).aspx
> # 'soon' on Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=471020
> add_header X-Content-Type-Options nosniff;
> 
> # This header enables the Cross-site scripting (XSS) filter built into most recent web browsers.
> # It's usually enabled by default anyway, so the role of this header is to re-enable the filter for 
> # this particular website if it was disabled by the user.
> # https://www.owasp.org/index.php/List_of_useful_HTTP_headers
> add_header X-XSS-Protection "1; mode=block";
> 
> # with Content Security Policy (CSP) enabled(and a browser that supports it(http://caniuse.com/#feat=contentsecuritypolicy),
> # you can tell the browser that it can only download content from the domains you explicitly allow
> # http://www.html5rocks.com/en/tutorials/security/content-security-policy/
> # https://www.owasp.org/index.php/Content_Security_Policy
> # I need to change our application code so we can increase security by disabling 'unsafe-inline' 'unsafe-eval'
> # directives for css and js(if you have inline css or js, you will need to keep it too).
> # more: http://www.html5rocks.com/en/tutorials/security/content-security-policy/#inline-code-considered-harmful
> add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ssl.google-analytics.com https://assets.zendesk.com https://connect.facebook.net; img-src 'self' https://ssl.google-analytics.com https://s-static.ak.facebook.com https://assets.zendesk.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.zendesk.com; font-src 'self' https://themes.googleusercontent.com; frame-src https://assets.zendesk.com https://www.facebook.com https://s-static.ak.facebook.com https://tautt.zendesk.com; object-src 'none'";
> 
> # redirect all http traffic to https
> server {
>   listen 80 default_server;
>   listen [::]:80 default_server;
>   server_name .forgott.com;
>   return 301 https://$host$request_uri;
> }
> 
> server {
>   listen 443 ssl http2;
>   listen [::]:443 ssl http2;
>   server_name .forgott.com;
> 
>   ssl_certificate /etc/nginx/ssl/star_forgott_com.crt;
>   ssl_certificate_key /etc/nginx/ssl/star_forgott_com.key;
> 
>   # enable session resumption to improve https performance
>   # http://vincent.bernat.im/en/blog/2011-ssl-session-reuse-rfc5077.html
>   ssl_session_cache shared:SSL:50m;
>   ssl_session_timeout 1d;
>   ssl_session_tickets off;
> 
>   # Diffie-Hellman parameter for DHE ciphersuites, recommended 2048 bits
>   ssl_dhparam /etc/nginx/ssl/dhparam.pem;
> 
>   # enables server-side protection from BEAST attacks
>   # http://blog.ivanristic.com/2013/09/is-beast-still-a-threat.html
>   ssl_prefer_server_ciphers on;
>   # disable SSLv3(enabled by default since nginx 0.8.19) since it's less secure then TLS http://en.wikipedia.org/wiki/Secure_Sockets_Layer#SSL_3.0
>   ssl_protocols TLSv1.2 TLSv1.3;
>   # ciphers chosen for forward secrecy and compatibility
>   # http://blog.ivanristic.com/2013/08/configuring-apache-nginx-and-openssl-for-forward-secrecy.html
>   ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
> 
>   # enable ocsp stapling (mechanism by which a site can convey certificate revocation information to visitors in a privacy-preserving, scalable manner)
>   # http://blog.mozilla.org/security/2013/07/29/ocsp-stapling-in-firefox/
>   resolver 8.8.8.8 8.8.4.4;
>   ssl_stapling on;
>   ssl_stapling_verify on;
>   ssl_trusted_certificate /etc/nginx/ssl/star_forgott_com.crt;
> 
>   # config to enable HSTS(HTTP Strict Transport Security) https://developer.mozilla.org/en-US/docs/Security/HTTP_Strict_Transport_Security
>   # to avoid ssl stripping https://en.wikipedia.org/wiki/SSL_stripping#SSL_stripping
>   # also https://hstspreload.org/
>   add_header Strict-Transport-Security "max-age=31536000; includeSubdomains; preload";
> 
>   # ... the rest of your configuration
> }
> ```

## Implicit "declarativeness"
I do catch myself doing stuff quickly to get it done, but forgetting what I changed later on. Not putting it in a repo or add it to the Ansible setup. I think everybody has done this a few times.

With NixOS this just doesn't really happen anymore. The only way I change stuff at the system level is through the NixOS configuration. I know that this is not a problem with Linux per se but if the OS can get me out of that bad habbit it is a win in my book.

## Nixpkgs has the most and newest packages
![[nixpkgs-map.png]]Image from [repology](https://repology.org/repositories/graphs).

Do I have to say more?

# How?
Now I that I have sold you on NixOS, you wanna know how to get into it. This is probably the hardest part. I have a few resources that helped me in my journey:

- https://nixos.org/learn/
- https://nixos-and-flakes.thiscute.world/
- https://search.nixos.org/packages
- https://search.nixos.org/options

Start with base NixOS, without Flakes. After you are comfortable with that, read into Flakes and what problems they solve.

Now I will go into what I do to provision and update my servers.

## Get NixOS on a server
It isn't really easy to get a NixOS server running, but there are ways to do it. The most common way and also what I use is [nixos-anywhere](https://github.com/nix-community/nixos-anywhere). This is also a bit confusing in the beginning but just refer to [Quickstart guide](https://github.com/nix-community/nixos-anywhere/blob/main/docs/quickstart.md) and it should work. 

Parts that I found confusing were:
- disko-config: Just use the [example lvm config](https://github.com/nix-community/nixos-anywhere-examples/blob/main/disk-config.nix) they provide. This should be good enough for most setups.
- kexec: I tried Debian and that didn't have kexec, but Ubuntu had it, so just stick with Ubuntu for the first OS
- ARM Mac: Use `--build-on-remote` for ARM Macs because you can't build the NixOS image for `x86` (full command: `nix run github:nix-community/nixos-anywhere -- --build-on-remote --flake ~/repo#hostname root@333.333.333.333`)
- ARM Mac rebuild: After you successfully ran nixos-anywhere once you can rebuild the host directly. On ARM Mac you need to build the system on the host again this the full command I use: `nixos-rebuild switch --flake ~/repo#hostname --build-host "root@333.333.333.333" --target-host "root@333.333.333.333" --fast`

## Secrets
This is another difficult topic to wrap your head around but it is very important. Now that you system is declarative you can't just put your secrets in the config files.

For this you want to use [sops-nix](https://github.com/Mic92/sops-nix). I will still try to explain the general idea behind it.

The files containing the secrets get encrypted with your local key and the key on the host machine. So that both you and the host machine can decrypt the secret. A key here is an [age-key](https://github.com/FiloSottile/age) but you can use your ed25519 ssh key as an age key.

The secrets inside of the `secrets.yaml` will then be mounted as files on your system at `/run/secrets/`. So every key will be a file with the value of that key. 

Example:
```yaml
cloudflare: |
  CLOUDFLARE_EMAIL=you@example.com
  CLOUDFLARE_API_KEY=b9841238feb177a84330febba8a83208921177bffe733
```
Will be `/run/secrets/cloudflare` with this content:
```env
CLOUDFLARE_EMAIL=you@example.com
CLOUDFLARE_API_KEY=b9841238feb177a84330febba8a83208921177bffe733
```

For most services in NixOS there is the possibility to then provide a secret file for a service for example the acme dns provider secret: [`security.acme.certs.<name>.environmentFile`](https://search.nixos.org/options?channel=unstable&show=security.acme.certs.%3Cname%3E.environmentFile&from=0&size=50&sort=relevance&type=packages&query=security.acme.certs.*.environment)

Adding onto the earlier example this would look like this:
```nix
{config, ...}: {
  security.acme.certs."awesome.domain".environmentFile = config.sops.secrets.cloudflare.path;
}
```

But these files are only generated on the host if you have the key defined in your Nix configuration somewhere. This can be an empty declaration, an owner assignment or anything else that defines that there is an object for that secret. 

For example:
```nix
{sops, ...}: {
  sops = {
    defaultSopsFile = ./secrets.yaml;
    secrets = {
      cloudflare.owner = "root";
      anotherSecret = {};
    };
  };
}
```

And with this you should be all set.

# Closing remarks
![[thank-you-nix.png]]
I am sold on NixOS. It was a bumpy road until I got here and it felt like I was learning Linux all over again, but I really think it was worth it. The grass really is greener here. Give NixOS a try and maybe you'll fall in love with it too.

You can also read about [[Docker Compose on NixOS|how I use docker-compose on NixOS]] and [[Monitoring|how I setup my monitoring stack on NixOS]].

> [!info]
> By the way I do think that NixOS is also awesome for a desktop environment, but I'm too deep into the MacOS rabbit hole.