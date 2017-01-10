**Current Version**: 1.1.0

Contains utility functions used by some of my other plugins. Just download it to your plugin folder and it works. No need to enable it.

If you're a plugin developer, feel free to use the utility plugin. You can pull out code to avoid dependency if you wish, but please credit. 
You could even copy and paste the entire code to the bottom of your plugin (minus meta tag) to avoid dependency.

## Console

Adds plugin name with choice of style to the front of console logging, helps differentiate which plugin is doing what.

## Utilities

- loadScript: Takes an id and url, appends script of url with id
- unloadScript: Takes an id, removes element with id
- getUser: Returns the logged in User
- getJSON: Takes a URL, returns Promise with data
- getGithubJSON: Takes branch and filename w/o extension, returns Promise with data
- getGithubHash: Takes a branch, returns Promise with hash
- getCDNFile: Takes option object with branch and filename, returns Promise with data
- saveStorage: Takes store name and data, compress with LZString and save in localStorage
- loadStorage: Loads from localStorage, uncompress with LZString and returns data
- getReactInstance: Returns React Data Instance or undefined
- getReactObject: Returns React Data Object or undefined
- getReactProps: Returns React Data Props or undefined
- $.fn.getReact____: Applies above to each element in the jQuery selector and returns an array containing the React Data for each element

## Events

Currently has the following events (provides mutation record/element as first callback argument):

- **joinVoiceChannel**: a user joins a voice channel, provides a user & voice channel
- **leaveVoiceChannel**:  a user leaves a voice channel, provides a voice channel
- **tooltipOver**: you hover over something and create a tooltip, provides nothing
- **tooltipOff**: you leave the hover area and remove a tooltip, provides nothing
- **switchTextChannel**: you switch between 2 text channels of the same server, provides old text channel and new text channel
- **switchServerChannel**: you switch servers, causing a switch of text channels, provides a text channel
- **loadTextChannel**: a text channel loads, provides a text channel
- **switchServer**: you switch between 2 servers, provides a server
- **loadServer**: a server loads, provides a server
- **loadFriendList**: friend list page loads, provides nothing
- **loadFriend**: friend loads on friend list, provides user and mutual servers
- **userTyping**: user is typing notification, provides text channel
- **showMemberList**: member list gets toggled on, provides nothing
- **hideMemberList**: member list gets toggled off, provides nothing
- **loadMemberListUser**: user gets loaded into member list, provides user and activity
- **userPopout**: user popout modal opens, provides a user
- **pinnedPopout**: pinned messages popout opens, provides a text channel
- **mentionsPopout**: mentions popout opens, provides nothing
- **contextMenu**: context menu appears, provides raw react props
- **subContextMenu**: sub-context menu appears, provides raw react props
- **message**: message is loaded, provides a message and user

Events may be triggered by something else I didn't prepare for.

If something unexpected happens, please create an issue or contact Natsulus with steps to reproduce whatever bug/undesired result which will help to fix it.

## Example

```js
start() {
    this.utility  = new BDUtility({
        repository: "Natsulus/BD-Repo",
        plugin: this,
        console: "My Plugin",
        style: "font-weight: bold; color: maroon;"
    });
    
    this.utility.info("Logged User:", this.utility.getUser());
    // [My Plugin] Logged User:     USER-OBJECT
    
    this.eventListeners();
}

observer(ev) {
    this.utility.eventObserver(ev);
}

eventListeners() {
    this.utility.on("message", (ev, message, user) => {
        this.utility.log(message, user);
    });
    this.utility.on("switchTextChannel", (ev, oldChannel, newChannel) => {
        this.utility.log(oldChannel, newChannel);
    });
}
```

### Planned

- Use own observer or intercept BD observer to avoid conflict of multiple plugins utilising it.
- More events (please tell Natsulus if you want any events added)
- Add an updater to keep this utility up-to-date