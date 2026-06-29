{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{
      self,
      nixpkgs,
      flake-parts,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } (_: {
      systems = nixpkgs.lib.systems.flakeExposed;

      perSystem =
        { config, pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            buildInputs = [
              pkgs.postgresql
              pkgs.nodejs_24
            ];

            shellHook = ''
              export dev_postgres="$PWD/dev-postgres"
              mkdir $dev_postgres
              export PGDATA="$dev_postgres/.pgdata"

              db_name=yaba
              username=yaba
              password='This_Is_Insecure_And_For_Development_Purposes_Only'

              cleanup () {
                pg_ctl stop
                rm -R $dev_postgres
              }
              trap cleanup EXIT

              # 2. Initialize the database directory
              initdb --auth=trust --no-locale

              # 3. Start the server using a local Unix socket to avoid permission errors
              # -h 127.0.0.1 -o "-k /tmp"
              pg_ctl -D "$PGDATA" -o "-k \"$PGDATA\"" -w start

              # 4. Create your default database
              createdb -h 127.0.0.1 "$db_name"

              createuser -h 127.0.0.1 "$username"
              psql -h 127.0.0.1 -d "$db_name" -c "GRANT USAGE, CREATE ON SCHEMA public TO $username;"

              export DATABASE_URL="postgresql://$username:$password@localhost:5432/$db_name"
              export REQUIRE_SECURE=0 # don't require HTTPS for development
              export JWT_SECRET_KEY='This_Is_Insecure_And_For_Development_Purposes_Only______________'
              export JWT_ISSUER='YABA'
              export JWT_AUDIENCE='YABA'
              export JWT_TOKEN_LIFETIME=300
            '';
          };
        };
    });
}
