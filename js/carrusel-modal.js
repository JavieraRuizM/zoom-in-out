document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = {};

    function showSlides(n, modalId) {
        let i;
        const modal = document.getElementById(modalId);
        const slides = modal.getElementsByClassName("carousel-item");
        const dots = modal.getElementsByClassName("dot");

        if (n > slides.length) { slideIndex[modalId] = 1; }
        if (n < 1) { slideIndex[modalId] = slides.length; }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex[modalId] - 1].style.display = "block";
        dots[slideIndex[modalId] - 1].className += " active";
    }

    function currentSlide(n, modalId) {
        showSlides(slideIndex[modalId] = n, modalId);
    }

    // Initialize slideIndex for each modal
    document.querySelectorAll('.modal').forEach(modal => {
        const modalId = modal.id;
        slideIndex[modalId] = 1;
        showSlides(slideIndex[modalId], modalId);
    });

    window.currentSlide = currentSlide; // Expose currentSlide to global scope for inline onclick handlers
});
