import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';

// loadFont() blocks rendering (delayRender) until the font files are ready.
export const playfair = loadPlayfair('normal', {
	weights: ['600', '700'],
	subsets: ['latin'],
}).fontFamily;

export const poppins = loadPoppins('normal', {
	weights: ['300', '400', '500'],
	subsets: ['latin'],
}).fontFamily;
