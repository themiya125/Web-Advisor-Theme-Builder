import { registerBlockType } from '@wordpress/blocks';
import './style.css';
import './blocks/button'; // Free block (always available)
import './blocks/faq-collapse';
import './blocks/pop-up';

   import'./blocks/main-menu';
    import'./blocks/div';
    import'./blocks/section';
    import'./blocks/container';
    import'./blocks/home-slider';
    import'./blocks/owl-slider';
    import'./blocks/social-media';
    import'./blocks/contact-info';
    import'./blocks/icon';
    import'./blocks/latest-blog-posts';
// Load Pro blocks only if license is valid
if (typeof wabProData !== 'undefined' && wabProData.licenseValid) {
 
  
} else {
   
}
