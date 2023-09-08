
let progressBrowser = null;

mp.events.add('showProgressBar', (icon) => {
  
    if(progressBrowser == null) progressBrowser = mp.browsers.new(`package://CEF/progressBar/index.html`);
 
    progressBrowser.execute(`document.getElementById('iconProgress-placeholder').innerHTML = '<i class = "${icon} progress-icon"></i>'`);  
});  
 

mp.events.add('destroyBrowserProgress', () => {
   
    if(progressBrowser != null)
    { 
        progressBrowser.destroy();
        progressBrowser = null;
    } 
}); 