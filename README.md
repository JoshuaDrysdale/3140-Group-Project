# 3140-Group-Project
3140 Group Project

# StudentMart

# Done so far
- React single page app
- css styling
- images added
- create a login/signup page

## Run
npm install
npm run dev


## Cloudinary Images
Product images are Cloudinary-ready in `client/app.js`.

After uploading images to Cloudinary, update:

```js
const CLOUDINARY_CONFIG = {
  cloudName: "your-cloud-name",
  folder: "schoolmart-products",
  transformations: "f_auto,q_auto,w_500"
};
```

If `cloudName` is empty, the app uses local images from `client/images`.
