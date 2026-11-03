import {loadFont as loadDMSerif} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';

export const dmSerif = loadDMSerif('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

export const montserrat = loadMontserrat('normal', {
	weights: ['500', '600'],
	subsets: ['latin'],
}).fontFamily;
