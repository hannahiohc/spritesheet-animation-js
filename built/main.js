class SpriteSheetAnimation {
    constructor(spriteSheetImage, frames, columns, retina) {
        // Initialization of sprite animation properties
        this.spriteSheetImage = spriteSheetImage;
        this.frames = frames;
        this.columns = columns;
        this.retina = retina;
        this.currentFrame = 0;
        this.playing = false;
        this.animationStarted = false;
        this.animationInterval = null;
        this.currentBreakPoint = null;
        this.matchedBreakpoint = false;

        this.loadBackgroundImage();
        this.handleViewportChange = this.handleViewportChange.bind(this);
        window.addEventListener('resize', this.handleViewportChange);
    }

    // Load background image and set up the sprite animation
    loadBackgroundImage() {
        const backgroundImageUrl = window.getComputedStyle(this.spriteSheetImage).backgroundImage.replace(/url\(['"]?([^'"]*)['"]?\)/i, '$1');
        const image = new Image();
        image.src = backgroundImageUrl;
        image.onload = () => {
            // Calculate frame dimensions for retina/non-retina displays
            const imageWidth = image.width;
            const imageHeight = image.height;
            const backgroundWidth = imageWidth / this.retina;
            const backgroundHeight = imageHeight / this.retina;
            this.frameWidth = (imageWidth / this.retina) / this.columns;
            this.frameHeight = (imageHeight / this.retina) / Math.ceil(this.frames / this.columns);
            this.spriteSheetImage.style.width = this.frameWidth + 'px';
            this.spriteSheetImage.style.height = this.frameHeight + 'px';
            this.spriteSheetImage.style.backgroundSize = `${backgroundWidth}px ${backgroundHeight}px`;

            this.play();
        }
    }

    // Set the background position of the animation
    setFrame(frameIndex) {
        console.log(frameIndex);
        const column = frameIndex % this.columns;
        const row = Math.floor(frameIndex / this.columns);
        const xOffset = -column * this.frameWidth;
        const yOffset = -row * this.frameHeight;
        this.spriteSheetImage.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
    }

    // Start the animation after a specified delay
    play(delay = 1000) {
        if (!this.playing && !this.animationStarted) {
            this.animationStarted = true;
            startframe.style.display = 'none';
            this.spriteSheetImage.style.display = 'block';
            
            setTimeout(() => {
                this.playing = true;
                this.animationInterval = setInterval(() => {
                    this.setFrame(this.currentFrame);
                    this.currentFrame = (this.currentFrame + 1) % this.frames;

                    // Stop the animation after one cycle and show replay button
                    if (this.currentFrame === 0) {
                        this.stop();
                        this.playing = false;
                        this.animationStarted = false;

                        button.classList.add('show');
                        button.addEventListener('click', () => {
                            startframe.style.display = 'block';
                            this.spriteSheetImage.style.display = 'none';

                            this.setFrame(0);
                            this.replay();      
                        });
                    }
                }, 33)
            }, delay)
        }
    }

    // Replay the animation
    replay() {
        button.classList.remove('show');
        
        setTimeout(() => {
            this.play();   
        }, 500);
    }

    // Stop the animation
    stop() {
        if (this.playing) {
            this.playing = false;
            clearInterval(this.animationInterval);
        }
    }

    // Destroy the animation and show fallback image
    destroy() {
        const fallback = document.querySelector('.image-fallback');
        this.destroyed = true;
        this.stop();
        spriteSheetImage.style.display = 'none';
        fallback.style.display = 'block';
    }

    // Destroy the animation and show fallback image if a breakpoint is matched
    handleViewportChange() {
        this.currentBreakPoint = this.matchedBreakpoint ? this.matchedBreakpoint.name : false;
        this.matchedBreakpoint = BREAKPOINTS.find(breakpoint => window.matchMedia(breakpoint.mediaQuery).matches);

        if (this.currentBreakPoint !== this.matchedBreakpoint.name && this.currentBreakPoint) {
            this.destroy();
        } 
    }
}

// Define breakpoints for responsive behavior
const BREAKPOINTS = [
    { name: "small", mediaQuery: "only screen and (max-width: 734px)" },
    { name: "medium", mediaQuery: "only screen and (max-width: 1068px)" },
    { name: "large", mediaQuery: "only screen and (min-width: 1069px)" }
];

const button = document.querySelector('button');
const spriteSheetImage = document.querySelector(".image-sprite"); // Sprite sheet image
const startframe = document.querySelector(".image-startframe");
const frames = 150; // Total number of frames in the sprite sheet
const columns = 10; // Number of columns in the sprite sheet
const retina = window.devicePixelRatio; // Detect the device pixel ratio for different screen resolutions (1x and 2x)
const spriteSheetAnimation = new SpriteSheetAnimation(spriteSheetImage, frames, columns, retina);

// Add event listener to start animation on page load after 1 second
window.addEventListener('load', () => {
    spriteSheetAnimation.play(1000); 
});
