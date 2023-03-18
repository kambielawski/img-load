const puppeteer = require('puppeteer')

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight - window.innerHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}

const createScreenshot = async props => {
  try {
    const { lang, width, theme, padding, hideCard, hideThread, tweetId } = props

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--start-maximized'],
      executablePath: '/usr/bin/google-chrome',
      // executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    });

    const page = await browser.newPage()
    const url = `https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=${hideCard}&hideThread=${hideThread}&id=${tweetId}&lang=${lang}&theme=${theme}&widgetsVersion=ed20a2b%3A1601588405575`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    let html = await page.content();

    // await autoScroll(page);
    // await page.waitForSelector('img[class=css-9pa8cd]') // Waits for Tweet profile image to load 
    //   .then(() => console.log('waited for first image'));

    await page.waitForFunction(() => {
        return Array.from(document.images).every(img => img.complete);
      }, {
        polling: 100, // Check every 100ms
        timeout: 30000 // Timeout after 30 seconds
      });
    // Wait for all images to load
    // let pageHeight = 1000;

    // Edit the webpage's elements

    if (theme == 'light') {
        await page.evaluate(() => {
            let info_date_box = document.querySelector(".css-1dbjc4n.r-1awozwy.r-18u37iz.r-1bymd8e");
            let like_rts_box = document.querySelector(".css-1dbjc4n.r-1habvwh.r-1ets6dv.r-5kkj8d.r-18u37iz.r-14gqq1x.r-1h8ys4a");
            let read_replies_box = document.querySelector(".css-1dbjc4n.r-kzbkwu.r-1h8ys4a");
            let expand_thread_box = document.querySelectorAll(".css-1dbjc4n.r-18u37iz.r-iphfwy")[1];

            // Make background transparent
            let bgelement = document.querySelector('.r-14lw9ot');
            bgelement.style.pointerEvents = null;
            bgelement.style.backgroundColor = 'transparent';
            bgelement.style.boxShadow = 'transparent';    
    
            info_date_box ? info_date_box.remove() : null;
            like_rts_box ? like_rts_box.remove() : null;
            read_replies_box ? read_replies_box.remove() : null;
            expand_thread_box ? expand_thread_box.remove() : null;
            
            // Remove border on Tweet
            let whole_tweet = document.querySelector(".css-1dbjc4n.r-1ets6dv.r-1q9bdsx.r-rs99b7.r-1loqt21.r-vakc41.r-y54riw.r-1udh08x");
            whole_tweet.style.border = 0;

            // Remove white background 
            whole_tweet.style.backgroundColor = 'transparent';
        });
    } else {
        // DARK MODE
        await page.evaluate(() => {
            let info_date_box = document.querySelector(".css-1dbjc4n.r-1awozwy.r-18u37iz.r-1bymd8e");
            let like_rts_box = document.querySelector(".css-1dbjc4n.r-1habvwh.r-126aqm3.r-5kkj8d.r-18u37iz.r-14gqq1x.r-1h8ys4a");
            let read_replies_box = document.querySelector(".css-1dbjc4n.r-kzbkwu.r-1h8ys4a");
            let expand_thread_box = document.querySelectorAll(".css-1dbjc4n.r-18u37iz.r-iphfwy")[1];
            
            info_date_box ? info_date_box.remove() : null;
            like_rts_box ? like_rts_box.remove() : null;
            read_replies_box ? read_replies_box.remove() : null;
            expand_thread_box ? expand_thread_box.remove() : null;
            
            // document.querySelector(".css-1dbjc4n").style.border = 0; // .r-1roi411.r-1q9bdsx.r-rs99b7.r-1loqt21.r-vakc41.r-y54riw.r-1udh08x");
            document.querySelector('.r-yfoy6g').style.backgroundColor = 'transparent';
            document.querySelector('.r-yfoy6g').style.border = 'transparent';
            // document.querySelector("#app > div > div > div > article").style.border = 0;
            document.querySelector("#app > div").style.border = 0;

            let whole_tweet = document.querySelector('.css-1dbjc4n.r-126aqm3.r-1q9bdsx.r-rs99b7.r-1loqt21.r-vakc41.r-y54riw.r-1udh08x');
            whole_tweet.style.border = 0;
        });
    }

    // Remove all constant elements
    await page.evaluate(() => {
        let follow_box = document.querySelector(".css-1dbjc4n.r-18u37iz.r-1q142lx");
        let twitter_logo = document.querySelector("path[d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z']");
        let thread_box = document.querySelector(".css-1dbjc4n.r-1v6e3re.r-1h8ys4a");

        thread_box ? thread_box.remove() : null;
        twitter_logo ? twitter_logo.remove() : null;
        follow_box ? follow_box.remove() : null;
    });

    // const embedDefaultWidth = 550
    const embedDefaultWidth = 550
    const percent = width / embedDefaultWidth
    const pageWidth = embedDefaultWidth * percent
    const pageHeight = 850
    await page.setViewport({ width: pageWidth, height: pageHeight, deviceScaleFactor: 4 })

    await autoScroll(page);

    await page.evaluate(props => {
        const { theme, padding, percent } = props

        const style = document.createElement('style')
        style.innerHTML = "* { font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important; }"
        document.getElementsByTagName('head')[0].appendChild(style)

        const body = document.querySelector('body')
        body.style.padding = `${padding}px`
        body.style.zoom = `${100 * percent}%`
        const articleWrapper = document.querySelector('#app > div')
        articleWrapper.style.border = 'none';
    }, ({ theme, padding, percent }));

    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: true,
      // encoding: 'base64',
      omitBackground: true,
      path: 'screenshot.png'
    })

    await browser.close()

    return imageBuffer;
  } catch (err) {
    console.log(err)
  }
}

// Tweet with one image, small, LIGHT 
createScreenshot({ lang: 'en', width: 650, theme: 'light', padding: 25, hideCard: false, hideThread: true, tweetId: '1624685050615988224' });
// Tweet with one image, small, DARK 
// createScreenshot({ lang: 'en', width: 650, theme: 'dark', padding: 25, hideCard: false, hideThread: true, tweetId: '1624685050615988224' });

// createScreenshot({ lang: 'en', width: 650, theme: 'light', padding: 25, hideCard: false, hideThread: true, tweetId: '1614775803644116993' });

