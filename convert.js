const fs = require('fs');

function htmlToJsx(file) {
    let html = fs.readFileSync(file, 'utf-8');
    
    // Extract everything between <body> and </body>
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let body = bodyMatch ? bodyMatch[1] : html;
    
    // Replace class= with className=
    body = body.replace(/class="/g, 'className="');
    
    // Replace for= with htmlFor=
    body = body.replace(/for="/g, 'htmlFor="');
    
    // Fix unclosed img/input
    body = body.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
    body = body.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
    body = body.replace(/<br>/g, '<br />');
    
    // Replace inline styles manually if there are any
    body = body.replace(/style="([^"]+)"/g, (match, p1) => {
        if (p1.includes('font-variation-settings')) {
            return "style={{ fontVariationSettings: \"'FILL' 1\" }}";
        }
        return match;
    });

    // Remove HTML comments completely
    body = body.replace(/<!--[\s\S]*?-->/g, '');

    return body;
}

try {
    const feedHtml = htmlToJsx('components/StitchVerticalFeed.html');
    fs.writeFileSync('components/StitchVerticalFeed.tsx', `import * as React from 'react';\n\nexport function StitchVerticalFeed() {\n  return (\n    <div className="bg-surface-container-lowest text-on-surface font-body overflow-hidden min-h-screen">\n      ${feedHtml}\n    </div>\n  );\n}\n`);

    const discoverHtml = htmlToJsx('components/StitchDiscover.html');
    fs.writeFileSync('components/StitchDiscover.tsx', `import * as React from 'react';\n\nexport function StitchDiscover() {\n  return (\n    <div className="bg-surface-container-lowest text-on-surface font-body antialiased min-h-screen pb-24">\n      ${discoverHtml}\n    </div>\n  );\n}\n`);

    console.log("Conversion successful!");
} catch (e) {
    console.error(e);
}
