# loan calculator

Build front end side with 

```
pushd client && yarn build && popd
```

Then build for pi with using rust-cross

```
touch src/main.rs
cross build --release --target arm-unknown-linux-musleabi
```
