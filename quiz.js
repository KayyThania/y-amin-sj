document.addEventListener('DOMContentLoaded', function() {
  // Elemen quiz
  const quizStart = document.getElementById('quiz-start');
  const quizQuestions = document.getElementById('quiz-questions');
  const quizResults = document.getElementById('quiz-results');
  const startBtn = document.getElementById('start-quiz-btn');
  const prevBtn = document.getElementById('prev-question');
  const nextBtn = document.getElementById('next-question');
  const submitBtn = document.getElementById('submit-quiz');
  const retakeBtn = document.getElementById('retake-quiz');
  const questionContainer = document.querySelector('.question-container');
  const progressBar = document.querySelector('.progress');
  const resultsContainer = document.querySelector('.results-container');
  
  // Data pertanyaan quiz
  const questions = [
    {
      id: 1,
      question: "Apa jenis kulit Anda?",
      type: "radio",
      options: [
        { value: "normal", text: "Normal - Tidak terlalu berminyak atau kering" },
        { value: "dry", text: "Kering - Terasa kencang dan mudah mengelupas" },
        { value: "oily", text: "Berminyak - Mengkilap terutama di T-zone" },
        { value: "combination", text: "Kombinasi - Berminyak di T-zone, normal/kering di area lain" },
        { value: "sensitive", text: "Sensitif - Mudah iritasi dan kemerahan" }
      ]
    },
    {
      id: 2,
      question: "Apa masalah kulit utama yang ingin Anda atasi? (Pilih maksimal 3)",
      type: "checkbox",
      options: [
        { value: "acne", text: "Jerawat dan breakout" },
        { value: "blackheads", text: "Komedo dan pori-pori tersumbat" },
        { value: "dullness", text: "Kulit kusam dan tidak bercahaya" },
        { value: "aging", text: "Tanda penuaan (kerutan, garis halus)" },
        { value: "hyperpigmentation", text: "Hiperpigmentasi dan noda hitam" },
        { value: "dryness", text: "Kekeringan dan kulit mengelupas" },
        { value: "redness", text: "Kemerahan dan iritasi" }
      ],
      maxSelect: 3
    },
    {
      id: 3,
      question: "Seberapa sering Anda menggunakan sunscreen?",
      type: "radio",
      options: [
        { value: "daily", text: "Setiap hari, bahkan di dalam ruangan" },
        { value: "outdoor", text: "Hanya saat beraktivitas di luar ruangan" },
        { value: "sometimes", text: "Kadang-kadang, saat ingat" },
        { value: "rarely", text: "Jarang atau tidak pernah" }
      ]
    },
    {
      id: 4,
      question: "Berapa usia Anda?",
      type: "radio",
      options: [
        { value: "under20", text: "Di bawah 20 tahun" },
        { value: "20-25", text: "20-25 tahun" },
        { value: "26-35", text: "26-35 tahun" },
        { value: "36-45", text: "36-45 tahun" },
        { value: "over45", text: "Di atas 45 tahun" }
      ]
    },
    {
      id: 5,
      question: "Apa preferensi makeup Anda?",
      type: "radio",
      options: [
        { value: "natural", text: "Natural/No-makeup look" },
        { value: "medium", text: "Medium coverage untuk sehari-hari" },
        { value: "full", text: "Full glam untuk acara khusus" },
        { value: "none", text: "Tidak menggunakan makeup" }
      ]
    },
    {
      id: 6,
      question: "Apa yang Anda cari dalam produk skincare? (Pilih maksimal 3)",
      type: "checkbox",
      options: [
        { value: "natural", text: "Bahan-bahan alami dan organik" },
        { value: "effective", text: "Efektivitas yang terbukti secara klinis" },
        { value: "affordable", text: "Harga terjangkau" },
        { value: "luxury", text: "Pengalaman mewah" },
        { value: "cruelty-free", text: "Cruelty-free dan vegan" },
        { value: "fragrance-free", text: "Bebas pewangi" }
      ],
      maxSelect: 3
    },
    {
      id: 7,
      question: "Berapa banyak langkah yang Anda inginkan dalam rutinitas skincare?",
      type: "radio",
      options: [
        { value: "minimal", text: "Minimal (1-3 langkah)" },
        { value: "moderate", text: "Sedang (4-6 langkah)" },
        { value: "extensive", text: "Ekstensif (7+ langkah)" }
      ]
    },
    {
      id: 8,
      question: "Apa warna lipstik yang paling sering Anda gunakan?",
      type: "radio",
      options: [
        { value: "nude", text: "Nude/MLBB (My Lips But Better)" },
        { value: "pink", text: "Pink/Coral" },
        { value: "red", text: "Merah" },
        { value: "berry", text: "Berry/Plum" },
        { value: "none", text: "Tidak menggunakan lipstik" }
      ]
    },
    {
      id: 9,
      question: "Apa jenis produk yang paling Anda minati saat ini?",
      type: "radio",
      options: [
        { value: "skincare", text: "Skincare" },
        { value: "makeup", text: "Makeup" },
        { value: "haircare", text: "Haircare" },
        { value: "bodycare", text: "Bodycare" }
      ]
    },
    {
      id: 10,
      question: "Berapa budget Anda untuk produk kecantikan per bulan?",
      type: "radio",
      options: [
        { value: "budget", text: "Di bawah Rp 200.000" },
        { value: "mid", text: "Rp 200.000 - Rp 500.000" },
        { value: "high", text: "Rp 500.000 - Rp 1.000.000" },
        { value: "luxury", text: "Di atas Rp 1.000.000" }
      ]
    }
  ];
  
  let currentQuestion = 0;
  let answers = {};
  
  // Mulai quiz
  startBtn.addEventListener('click', function() {
    quizStart.classList.remove('active');
    quizQuestions.classList.add('active');
    showQuestion(currentQuestion);
    updateProgressBar();
  });
  
  // Tampilkan pertanyaan
  function showQuestion(index) {
    const question = questions[index];
    let html = `
      <div class="question">
        <h3>${question.question}</h3>
        <div class="options">
    `;
    
    if (question.type === 'radio') {
      question.options.forEach(option => {
        const checked = answers[question.id] === option.value ? 'checked' : '';
        html += `
          <label class="option">
            <input type="radio" name="question-${question.id}" value="${option.value}" ${checked}>
            <span>${option.text}</span>
          </label>
        `;
      });
    } else if (question.type === 'checkbox') {
      question.options.forEach(option => {
        const checked = answers[question.id] && answers[question.id].includes(option.value) ? 'checked' : '';
        html += `
          <label class="option">
            <input type="checkbox" name="question-${question.id}" value="${option.value}" ${checked} data-max="${question.maxSelect}">
            <span>${option.text}</span>
          </label>
        `;
      });
      html += `<p class="checkbox-hint">Pilih maksimal ${question.maxSelect} opsi</p>`;
    }
    
    html += `
        </div>
      </div>
    `;
    
    questionContainer.innerHTML = html;
    
    // Event listener untuk checkbox (batasi pilihan)
    if (question.type === 'checkbox') {
      const checkboxes = document.querySelectorAll(`input[name="question-${question.id}"]`);
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const checked = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
          const maxSelect = parseInt(this.getAttribute('data-max'));
          
          if (checked.length > maxSelect) {
            this.checked = false;
          }
        });
      });
    }
    
    // Update tombol navigasi
    prevBtn.disabled = index === 0;
    
    if (index === questions.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
    } else {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
    }
  }
  
  // Update progress bar
  function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  // Simpan jawaban
  function saveAnswer() {
    const question = questions[currentQuestion];
    
    if (question.type === 'radio') {
      const selected = document.querySelector(`input[name="question-${question.id}"]:checked`);
      if (selected) {
        answers[question.id] = selected.value;
      }
    } else if (question.type === 'checkbox') {
      const selected = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
      if (selected.length > 0) {
        answers[question.id] = Array.from(selected).map(el => el.value);
      }
    }
  }
  
  // Navigasi ke pertanyaan berikutnya
  nextBtn.addEventListener('click', function() {
    saveAnswer();
    currentQuestion++;
    showQuestion(currentQuestion);
    updateProgressBar();
  });
  
  // Navigasi ke pertanyaan sebelumnya
  prevBtn.addEventListener('click', function() {
    saveAnswer();
    currentQuestion--;
    showQuestion(currentQuestion);
    updateProgressBar();
  });
  
  // Submit quiz
  submitBtn.addEventListener('click', function() {
    saveAnswer();
    showResults();
  });
  
  // Tampilkan hasil
  function showResults() {
    quizQuestions.classList.remove('active');
    quizResults.classList.add('active');
    
    // Analisis jawaban dan tampilkan rekomendasi
    const recommendations = generateRecommendations(answers);
    
    let html = '';
    recommendations.forEach(product => {
      html += `
        <div class="product-recommendation">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price}</div>
          </div>
        </div>
      `;
    });
    
    resultsContainer.innerHTML = html;
  }
  
  // Generate rekomendasi berdasarkan jawaban
  function generateRecommendations(answers) {
    const recommendations = [];
    
    // Rekomendasi berdasarkan jenis kulit
    if (answers[1]) {
      const skinType = answers[1];
      
      if (skinType === 'dry') {
        recommendations.push({
          name: 'COSRX Advanced Snail 92 All In One Cream',
          description: 'Krim pelembap intensif dengan ekstrak snail mucin untuk kulit kering',
          price: 'Rp 250.000',
          image: 'https://i.pinimg.com/736x/62/3e/07/623e076e499823915c456a43b817f985.jpg'
        });
      } else if (skinType === 'oily') {
        recommendations.push({
          name: 'The Ordinary Niacinamide 10% + Zinc 1%',
          description: 'Serum untuk mengontrol produksi minyak dan memperkecil tampilan pori',
          price: 'Rp 180.000',
          image: 'https://i.pinimg.com/736x/df/c4/d0/dfc4d044f6a4335acde482e40473afbc.jpg'
        });
      } else if (skinType === 'combination') {
        recommendations.push({
          name: 'Some By Mi AHA-BHA-PHA 30 Days Miracle Serum',
          description: 'Serum dengan 3 jenis asam untuk menyeimbangkan kulit kombinasi',
          price: 'Rp 220.000',
          image: 'https://i.pinimg.com/736x/84/0b/2b/840b2b48f8cc822ccb781d087eae0eb2.jpg'
        });
      } else if (skinType === 'sensitive') {
        recommendations.push({
          name: 'Avene Thermal Spring Water',
          description: 'Air termal menenangkan untuk kulit sensitif',
          price: 'Rp 200.000',
          image: 'https://i.pinimg.com/736x/ec/53/a8/ec53a84d7d4da6adda884ee8684b1bc2.jpg'
        });
      } else if (skinType === 'normal') {
        recommendations.push({
          name: 'Laneige Water Bank Blue Hyaluronic Cream',
          description: 'Krim pelembap ringan untuk kulit normal',
          price: 'Rp 350.000',
          image: 'https://i.pinimg.com/736x/d4/09/e9/d409e9a3f1967ae3083d38715f01905c.jpg'
        });
      }
    }
    
    // Rekomendasi berdasarkan masalah kulit
    if (answers[2]) {
      const skinConcerns = answers[2];
      
      if (skinConcerns.includes('acne')) {
        recommendations.push({
          name: 'COSRX Acne Pimple Master Patch',
          description: 'Patch jerawat untuk menyembuhkan jerawat dengan cepat',
          price: 'Rp 50.000',
          image: 'https://i.pinimg.com/736x/fa/d5/67/fad567401049577e7d462f7f95dbe37f.jpg'
        });
      }
      
      if (skinConcerns.includes('aging')) {
        recommendations.push({
          name: 'Kiehl\'s Powerful-Strength Line-Reducing Concentrate',
          description: 'Serum vitamin C untuk mengurangi garis halus dan kerutan',
          price: 'Rp 950.000',
          image: 'https://i.pinimg.com/736x/0f/76/c3/0f76c374d370903bfae97e7395fc9b55.jpg'
        });
      }
      
      if (skinConcerns.includes('hyperpigmentation')) {
        recommendations.push({
          name: 'ANUA Peach 70% Niacinamide Serum',
          description: 'Serum niacinamide konsentrasi tinggi untuk mencerahkan noda hitam',
          price: 'Rp 350.000',
          image: 'https://i.pinimg.com/736x/d4/09/e9/d409e9a3f1967ae3083d38715f01905c.jpg'
        });
      }
      
      if (skinConcerns.includes('dryness')) {
        recommendations.push({
          name: 'Laneige Water Sleeping Mask',
          description: 'Masker tidur melembapkan untuk kulit kering',
          price: 'Rp 350.000',
          image: 'https://i.pinimg.com/736x/a4/67/aa/a467aa9439c3dbb3f8ba987f491efba4.jpg'
        });
      }
    }
    
    // Rekomendasi berdasarkan preferensi makeup
    if (answers[5]) {
      const makeupPreference = answers[5];
      
      if (makeupPreference === 'natural') {
        recommendations.push({
          name: 'Rare Beauty Liquid Touch Brightening Concealer',
          description: 'Concealer ringan untuk tampilan natural',
          price: 'Rp 450.000',
          image: 'https://i.pinimg.com/736x/20/aa/e2/20aae236b92f3173fd9214eed4a06a21.jpg'
        });
      } else if (makeupPreference === 'medium') {
        recommendations.push({
          name: 'Maybelline Fit Me Matte + Poreless Foundation',
          description: 'Foundation medium coverage dengan finish matte',
          price: 'Rp 180.000',
          image: 'https://i.pinimg.com/736x/71/0e/9e/710e9e2dae353907be87373c86fd546e.jpg'
        });
      } else if (makeupPreference === 'full') {
        recommendations.push({
          name: 'Huda Beauty Faux Filter Foundation',
          description: 'Foundation full coverage untuk tampilan flawless',
          price: 'Rp 750.000',
          image: 'https://i.pinimg.com/736x/60/1c/8b/601c8b0b0e32d5fffabcc2791f2163db.jpg'
        });
      }
    }
    
    // Rekomendasi berdasarkan warna lipstik
    if (answers[8]) {
      const lipstickPreference = answers[8];
      
      if (lipstickPreference === 'nude') {
        recommendations.push({
          name: 'Barenbliss Cherry Makes Cheerful Lip Velvet',
          description: 'Lip tint velvet dengan warna nude yang tahan lama',
          price: 'Rp 120.000',
          image: 'https://i.pinimg.com/736x/1a/7d/20/1a7d20a4d8e191a7d99e9028938367ef.jpg'
        });
      } else if (lipstickPreference === 'pink') {
        recommendations.push({
          name: 'peripera Ink Velvet Lip Tint',
          description: 'Lip tint dengan warna pink yang pigmented',
          price: 'Rp 100.000',
          image: 'https://i.pinimg.com/736x/7e/8c/9f/7e8c9f06c61d1228bfe1e00e289bacfa.jpg'
        });
      } else if (lipstickPreference === 'red') {
        recommendations.push({
          name: 'MAC Ruby Woo Lipstick',
          description: 'Lipstik merah ikonik dengan finish matte',
          price: 'Rp 350.000',
          image: 'https://i.pinimg.com/736x/a4/60/73/a46073f7b8347e60196005d9b6e28f51.jpg'
        });
      }
    }
    
    // Tambahkan blush jika tidak ada cukup rekomendasi
    if (recommendations.length < 3) {
      recommendations.push({
        name: 'peripera - Pure Blushed Sunshine Cheek',
        description: 'Blush dengan finish natural dan buildable',
        price: 'Rp 150.000',
        image: 'https://i.pinimg.com/736x/5d/96/11/5d96119c442b4aa43c26389d840385f2.jpg'
      });
    }
    
    return recommendations;
  }
  
  // Ambil quiz lagi
  retakeBtn.addEventListener('click', function() {
    quizResults.classList.remove('active');
    quizStart.classList.add('active');
    currentQuestion = 0;
    answers = {};
  });
});