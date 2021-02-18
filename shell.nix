# the last successful build of nixos-20.09 (stable) as of 2021-03-23
with import
  (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/f8929dce13e7.tar.gz";
    sha256 = "06ikqdb5038vkkyx4hi5lw4gksjjndjg7mz0spawnb1gpzhqkavs";
  })
{ };

let
  SuitePython = python3.withPackages(ps: [
    ps.yamllint
  ]);
in
  stdenv.mkDerivation {
    name = "trezor-suite-dev";
    buildInputs = [
      bash
      git-lfs
      gnupg
      mdbook
      xorg.xhost     # for e2e tests running on localhost
      docker         # for e2e tests running on localhost
      docker-compose # for e2e tests running on localhost
      nodejs-14_x
      yarn
      SuitePython
    ] ++ lib.optionals stdenv.isLinux [
      pkg-config
      python2                                                     # older node-gyp still requires python2.x
      p7zip                                                       # binaries used by node_module: 7zip-bin
      appimagekit nsis openjpeg osslsigncode p7zip squashfsTools  # binaries used by node_module: electron-builder
      cairo giflib libjpeg libpng librsvg libuuid pango           # build dependencies for node-canvas
      # winePackages.minimal
    ] ++ lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
      Cocoa
      CoreServices
    ]);
    shellHook = ''
      export NODE_OPTIONS=--max_old_space_size=4096
      export CURDIR="$(pwd)"
      export PATH="$PATH:$CURDIR/node_modules/.bin"
      export ELECTRON_BUILDER_CACHE="$CURDIR/.cache/electron-builder"
    '' + lib.optionalString stdenv.isLinux ''
      export npm_config_build_from_source=true  # tell yarn to not download binaries, but build from source
    '';
  }
