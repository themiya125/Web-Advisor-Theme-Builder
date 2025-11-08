import { registerBlockType } from '@wordpress/blocks';
import './style.css';
import './blocks/button'; // Free block (always available)

// Load Pro blocks only if license is valid
if (typeof wabProData !== 'undefined' && wabProData.licenseValid) {
    import('./blocks/div');
    import('./blocks/section');
    import('./blocks/container');
    import('./blocks/home-slider');
     import('./blocks/owl-slider');
      import('./blocks/faq-collapse');
} else {
    console.warn("⚠️ Web Advisor Pro features are locked. Activate your license to unlock all blocks!");
}
