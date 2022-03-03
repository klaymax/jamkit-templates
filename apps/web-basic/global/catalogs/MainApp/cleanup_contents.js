document.addEventListener('DOMContentLoaded', function() {
    var cleanup_contents_style = document.createElement('style');

    cleanup_contents_style.innerHTML = `
        none {
            display: none !important;
        }
    `;

    document.head.appendChild(cleanup_contents_style);
});
