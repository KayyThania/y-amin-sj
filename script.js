// Debug Mode
const DEBUG = true;

function debug(message) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`);
  }
}

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  debug('DOM fully loaded');
  
  // Prioritaskan navigasi terlebih dahulu
  const navLinks = document.querySelectorAll('nav a');
  debug(`Found ${navLinks.length} navigation links`);
  
  // Hapus event listener yang ada pada tautan navigasi
  navLinks.forEach((link, index) => {
    const oldLink = link.cloneNode(true);
    link.parentNode.replaceChild(oldLink, link);
    
    // Tambahkan event listener baru dengan prioritas tinggi
    oldLink.addEventListener('click', function(e) {
      debug(`Navigation link clicked: ${oldLink.href}`);
      // Biarkan default behavior (navigasi) terjadi
      return true;
    }, true);
  });
  
  // Pisahkan event handler untuk tautan artikel
  const articleLinks = document.querySelectorAll('.article-link, .read-more');
  debug(`Found ${articleLinks.length} article links`);
  
  articleLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      debug(`Article link clicked: ${link.href}`);
      // Biarkan default behavior (navigasi) terjadi
      e.stopPropagation();
      return true;
    });
  });
  
  // Inisialisasi carousel jika ada
  initCarousel();
  
  // Inisialisasi modal artikel jika ada
  initArticleModal();
  
  // Tambahkan event listener global untuk debugging
  document.body.addEventListener('click', function(e) {
    debug(`Body clicked at: ${e.clientX}, ${e.clientY}`);
    // Jangan hentikan event bubbling di sini
  }, true);
});

function initCarousel() {
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (!carouselWrapper) {
    debug('No carousel found');
    return;
  }
  
  debug('Initializing carousel');
  
  const slides = document.querySelectorAll('.carousel-slide');
  const nextButton = document.querySelector('.carousel-button.next');
  const prevButton = document.querySelector('.carousel-button.prev');
  const dots = Array.from(document.querySelectorAll('.dot'));
  
  if (!slides.length || !nextButton || !prevButton) {
    debug("Carousel elements not found");
    return;
  }
  
  debug(`Found ${slides.length} slides`);
  
  let currentIndex = 0;
  
  // Fungsi untuk menggeser slide
  function moveToSlide(index) {
    const carouselSlides = document.querySelector('.carousel-slides');
    if (!carouselSlides) return;
    
    carouselSlides.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dot aktif
    const activeDot = document.querySelector('.dot.active');
    if (activeDot) {
      activeDot.classList.remove('active');
    }
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    
    currentIndex = index;
    debug(`Moved to slide ${index}`);
  }
  
  // Event listener untuk tombol next
  nextButton.addEventListener('click', function(e) {
    debug('Next button clicked');
    e.preventDefault();
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % slides.length;
    moveToSlide(currentIndex);
    return false;
  });
  
  // Event listener untuk tombol prev
  prevButton.addEventListener('click', function(e) {
    debug('Prev button clicked');
    e.preventDefault();
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(currentIndex);
    return false;
  });
  
  // Event listener untuk dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function(e) {
      debug(`Dot ${index} clicked`);
      e.preventDefault();
      e.stopPropagation();
      moveToSlide(index);
      return false;
    });
  });
  
  // Isolasi event pada carousel
  carouselWrapper.addEventListener('click', function(e) {
    // Jangan hentikan event jika yang diklik adalah tautan navigasi
    if (e.target.closest('nav a')) {
      debug('Navigation link clicked inside carousel - allowing propagation');
      return true;
    }
    
    // Hentikan event bubbling untuk elemen carousel
    debug('Carousel element clicked - stopping propagation');
    e.stopPropagation();
  });
  
  // Auto slide setiap 5 detik
  let autoSlideInterval = setInterval(function() {
    currentIndex = (currentIndex + 1) % slides.length;
    moveToSlide(currentIndex);
  }, 5000);
  
  // Hentikan auto slide saat user berinteraksi
  carouselWrapper.addEventListener('mouseenter', function() {
    debug('Mouse entered carousel - pausing auto slide');
    clearInterval(autoSlideInterval);
  });
  
  // Mulai lagi auto slide saat mouse keluar
  carouselWrapper.addEventListener('mouseleave', function() {
    debug('Mouse left carousel - resuming auto slide');
    autoSlideInterval = setInterval(function() {
      currentIndex = (currentIndex + 1) % slides.length;
      moveToSlide(currentIndex);
    }, 5000);
  });
}

function initArticleModal() {
  // Modal elements
  const readMoreLinks = document.querySelectorAll('.read-more[data-article]');
  const modal = document.getElementById('articleModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeBtn = document.querySelector('.close-btn');
  const articleDatabase = document.getElementById('articleDatabase');

  if (!modal || !readMoreLinks.length || !modalTitle || !modalDesc || !closeBtn || !articleDatabase) return;

  readMoreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const articleId = this.getAttribute('data-article');
      const articleContent = articleDatabase.querySelector(`div[data-article="${articleId}"]`);

      if (articleContent) {
        modalTitle.innerHTML = articleContent.querySelector('h2')?.innerHTML || '';
        modalDesc.innerHTML = articleContent.querySelectorAll('p').length > 0
          ? Array.from(articleContent.querySelectorAll('p')).map(p => p.innerHTML).join('<br><br>')
          : '';
        modal.style.display = 'block';
      }
      return false;
    });
  });

  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    modal.style.display = 'none';
    return false;
  });

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}


// Beauty Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Quiz elements
  const startBtn = document.getElementById('start-quiz-btn');
  const quizStart = document.getElementById('quiz-start');
  const quizQuestions = document.getElementById('quiz-questions');
  const quizResults = document.getElementById('quiz-results');
  const prevBtn = document.getElementById('prev-question');
  const nextBtn = document.getElementById('next-question');
  const submitBtn = document.getElementById('submit-quiz');
  const retakeBtn = document.getElementById('retake-quiz');
  const questions = document.querySelectorAll('.question');
  const resultsContainer = document.querySelector('.results-container');
  
  let currentQuestion = 1;
  
  // Start quiz
  if (startBtn) {
    startBtn.addEventListener('click', function() {
      quizStart.classList.remove('active');
      quizQuestions.classList.add('active');
    });
  }
  
  // Navigate to next question
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const currentQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
      currentQuestionEl.style.display = 'none';
      
      currentQuestion++;
      const nextQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
      nextQuestionEl.style.display = 'block';
      
      prevBtn.disabled = false;
      
      if (currentQuestion === questions.length) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
      }
    });
  }
  
  // Navigate to previous question
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      const currentQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
      currentQuestionEl.style.display = 'none';
      
      currentQuestion--;
      const prevQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
      prevQuestionEl.style.display = 'block';
      
      if (currentQuestion === 1) {
        prevBtn.disabled = true;
      }
      
      nextBtn.style.display = 'block';
      submitBtn.style.display = 'none';
    });
  }
  
  // Submit quiz
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      quizQuestions.classList.remove('active');
      quizResults.classList.add('active');
      
      // Get user answers
      const skinType = document.querySelector('input[name="skin-type"]:checked')?.value;
      const skinConcerns = Array.from(document.querySelectorAll('input[name="skin-concern"]:checked')).map(input => input.value);
      const makeupStyle = document.querySelector('input[name="makeup-style"]:checked')?.value;
      
      // Generate recommendations based on answers
      generateRecommendations(skinType, skinConcerns, makeupStyle);
    });
  }
  
  // Retake quiz
  if (retakeBtn) {
    retakeBtn.addEventListener('click', function() {
      quizResults.classList.remove('active');
      quizStart.classList.add('active');
      
      // Reset quiz
      currentQuestion = 1;
      questions.forEach((question, index) => {
        if (index === 0) {
          question.style.display = 'block';
        } else {
          question.style.display = 'none';
        }
      });
      
      // Reset form
      document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        input.checked = false;
      });
      
      document.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
        input.checked = false;
      });
      
      prevBtn.disabled = true;
      nextBtn.style.display = 'block';
      submitBtn.style.display = 'none';
    });
  }
  
  // Generate product recommendations
  function generateRecommendations(skinType, skinConcerns, makeupStyle) {
    resultsContainer.innerHTML = '';
    
    // Sample product recommendations based on user answers
    const products = [];
    
    // Skincare recommendations based on skin type
    if (skinType === 'dry') {
      products.push({
        name: 'Laneige Water Bank Moisture Cream',
        description: 'Hydrating cream perfect for dry skin',
        price: 'Rp350.000',
        image: 'https://i.pinimg.com/736x/d4/09/e9/d409e9a3f1967ae3083d38715f01905c.jpg'
      });
    } else if (skinType === 'oily') {
      products.push({
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        description: 'Controls sebum and reduces pore appearance',
        price: 'Rp180.000',
        image: 'https://i.pinimg.com/736x/be/a9/5d/bea95d389bdd7804143e96dd1ca6e089.jpg'
      });
    } else if (skinType === 'combination') {
      products.push({
        name: 'COSRX Advanced Snail 96 Mucin Power Essence',
        description: 'Balances combination skin with hydration',
        price: 'Rp250.000',
        image: 'https://i.pinimg.com/736x/d4/09/e9/d409e9a3f1967ae3083d38715f01905c.jpg'
      });
    } else if (skinType === 'sensitive') {
      products.push({
        name: 'Avene Thermal Spring Water',
        description: 'Soothes and calms sensitive skin',
        price: 'Rp200.000',
        image: 'https://i.pinimg.com/736x/be/a9/5d/bea95d389bdd7804143e96dd1ca6e089.jpg'
      });
    }
    
    // Makeup recommendations based on style
    if (makeupStyle === 'natural') {
      products.push({
        name: 'Rare Beauty Liquid Touch Foundation',
        description: 'Lightweight foundation for a natural finish',
        price: 'Rp450.000',
        image: 'https://i.pinimg.com/736x/22/92/da/2292da464122fc7b31158f8ca02a2bf7.jpg'
      });
    } else if (makeupStyle === 'glam') {
      products.push({
        name: 'Huda Beauty Eyeshadow Palette',
        description: 'Pigmented shades for dramatic looks',
        price: 'Rp850.000',
        image: 'https://i.pinimg.com/736x/22/92/da/2292da464122fc7b31158f8ca02a2bf7.jpg'
      });
    } else if (makeupStyle === 'minimal') {
      products.push({
        name: 'Barenbliss Cherry Makes Cheerful Lip Velvet',
        description: 'Versatile lip tint for everyday wear',
        price: 'Rp120.000',
        image: 'https://i.pinimg.com/736x/22/92/da/2292da464122fc7b31158f8ca02a2bf7.jpg'
      });
    }
    
    // Additional product based on skin concerns
    if (skinConcerns.includes('acne')) {
      products.push({
        name: 'Some By Mi AHA-BHA-PHA 30 Days Miracle Serum',
        description: 'Treats acne and prevents breakouts',
        price: 'Rp220.000',
        image: 'https://i.pinimg.com/736x/d4/09/e9/d409e9a3f1967ae3083d38715f01905c.jpg'
      });
    }
    
    if (skinConcerns.includes('aging')) {
      products.push({
        name: 'Kiehl\'s Powerful-Strength Line-Reducing Concentrate',
        description: 'Reduces fine lines and wrinkles',
        price: 'Rp950.000',
        image: 'https://i.pinimg.com/736x/be/a9/5d/bea95d389bdd7804143e96dd1ca6e089.jpg'
      });
    }
    
    // Render product recommendations
    products.forEach(product => {
      const productEl = document.createElement('div');
      productEl.className = 'product-recommendation';
      productEl.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <div class="product-price">${product.price}</div>
        </div>
      `;
      resultsContainer.appendChild(productEl);
    });
  }
});