// sub component wish list

// h1
// h2
// icon
// p
// link
// cta
// spacer
// email (202d)
// phone (202d)
// bullet (205)
// icon bullet (205e)

// plan: each comp that uses sub-components will have a subCompArray[] for storing and sorting it's added subcomponents
//       ui has to add from a list of sub-compoents
//       how to best edit them?  
//       each sub has input form fields which can be dymanically presented?

const subH1 = {
    code: `<h1 class="birch-text-styles-h1" style="Margin: 0; Margin-bottom: birch_subH1MarginBottom_birchpx; color: birch_subH1TextColor_birch; font-family: Arial; font-size: 21px; font-style: normal; font-weight: 400; line-height: normal; margin: 0; margin-bottom: birch_subH1MarginBottom_birchpx; padding: 0; text-align: birch_subH1Align_birch; word-wrap: normal;">birch_subH1Text_birch</h1>`,
    subH1Text: `This is the H1 sub-component`,
    subH1MarginBottom: `10`,
    subH1TextColor: `red`,
    subH1Align: `left`
}

const subH2 = {
    code: `<h2 class="birch-text-styles-h2" style="Margin: 0; Margin-bottom: birch_subH2MarginBottom_birchpx; color: birch_subH2TextColor_birch; font-family: Arial; font-size: 20px; font-style: normal; font-weight: bold; line-height: 21px; margin: 0; margin-bottom: birch_subH2MarginBottom_birchpx; padding: 0; text-align: birch_subH2Align_birch; word-wrap: normal;">birch_subH2Text_birch</h2>`,
    subH2Text: `This is the H2 sub-component`,
    subH2MarginBottom: `10`,
    subH2TextColor: `red`,
    subH2Align: `left`
}