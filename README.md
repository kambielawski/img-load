# Instructions:

Primary goal: get the Puppeteer images to load consistently. 

Current behavior: If you run `node test-screenshot.js` once, it seems to work well: i.e. both the profile image and the Tweet image load fully. But if you run `node test-screenshot.js` many times, sometimes the profile image won't load, or sometimes the Tweet image won't load, or both. 

Desired behavior: Every single call to createScreenshot() returns a fully-loaded image of a Tweet. 

How I will test desired behavior: 20 back-to-back executions of `node test-screenshot.js` with the Tweet fully loaded each execution.

Constraints: 
1. Must run headless. This will run in a Docker container. 
2. All new libraries should be documented. 
