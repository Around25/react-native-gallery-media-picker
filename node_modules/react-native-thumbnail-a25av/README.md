
# react-native-thumbnail-a25av
Get thumbnail from local media.

**I updated it only for Android.** If anyone wants to contribute for the iOS part, I will gladly review/accept PRs.

**Tt only supports video files from camera roll and it ignores images.**

This is the most updated version of react-native-thumbnail.

## Getting started

`$ npm install react-native-thumbnail --save`

### Mostly automatic installation

`$ react-native link react-native-thumbnail`

After the linking process is complete, continue by checking the files mentioned in the *Manual installation* section, because `react-native link` has a tendency of not working perfectly and it might change files or duplicate some lines which are going to cause your build to fail.

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-thumbnail` and add `RNThumbnail.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNThumbnail.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNThumbnailPackage;` to the imports at the top of the file
  - Add `new RNThumbnailPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-thumbnail'
  	project(':react-native-thumbnail').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-thumbnail/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-thumbnail')
  	```

## Usage
Filepath should be a "content://" schema Uri.

```javascript
import RNThumbnail from 'react-native-thumbnail';

RNThumbnail.get(filepath).then((result) => {
  console.log(result.path); // thumbnail path
})
```
