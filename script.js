// حالة التطبيق
let currentSlide = 0;
const totalSlides = 11;
let thinkingTimer = 120;
let timerInterval;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    // تعيين التاريخ الحالي
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('current-date').textContent = dateStr;
    document.getElementById('current-date-footer').textContent = dateStr;

    // محاكاة التحميل
    let progress = 0;
    const progressBar = document.getElementById('load-progress');
    const loadInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                document.getElementById('loading').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('main-screen').classList.add('active');
                    updateProgress();
                    startThinkingTimer();
                }, 500);
            }, 300);
        }
    }, 100);

    // تحديث عدد الشرائح
    document.getElementById('total-slides').textContent = totalSlides;

    // إعداد مفاتيح الأسهم
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'Right') prevSlide();
        if (e.key === 'ArrowLeft' || e.key === 'Left') nextSlide();
        if (e.key === 'Home') goToSlide(0);
        if (e.key === 'End') goToSlide(totalSlides - 1);
        if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key) - 1;
            if (slideNum < totalSlides) goToSlide(slideNum);
        }
    });
});

// الانتقال للشريحة التالية
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        document.querySelector('.slide.active').classList.remove('active');
        currentSlide++;
        document.getElementById('slide' + (currentSlide + 1)).classList.add('active');
        updateProgress();

        // إذا كانت الشريحة 10 (الأسئلة) أعد تشغيل المؤقت
        if (currentSlide === 9) {
            startThinkingTimer();
        }
    }
}

// الانتقال للشريحة السابقة
function prevSlide() {
    if (currentSlide > 0) {
        document.querySelector('.slide.active').classList.remove('active');
        currentSlide--;
        document.getElementById('slide' + (currentSlide + 1)).classList.add('active');
        updateProgress();
    }
}

// تحديث شريط التقدم
function updateProgress() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    document.getElementById('slide-progress').style.width = progress + '%';
    document.getElementById('current-slide').textContent = currentSlide + 1;

    // تحديث أزرار التنقل
    document.getElementById('prev-btn').disabled = currentSlide === 0;
    document.getElementById('next-btn').innerHTML = currentSlide === totalSlides - 1
        ? 'النهاية <i class="fas fa-flag-checkered"></i>'
        : 'الشريحة التالية <i class="fas fa-arrow-left"></i>';
}

// مؤقت التفكير
function startThinkingTimer() {
    clearInterval(timerInterval);
    thinkingTimer = 120;
    document.getElementById('timer-count').textContent = thinkingTimer;

    timerInterval = setInterval(() => {
        thinkingTimer--;
        document.getElementById('timer-count').textContent = thinkingTimer;

        if (thinkingTimer <= 0) {
            clearInterval(timerInterval);
            // إظهار جميع الإجابات تلقائياً
            showAnswer('answer1');
            showAnswer('answer2');
            showAnswer('answer3');
        }
    }, 1000);
}

// عرض الإجابة
function showAnswer(answerId) {
    const answerBox = document.getElementById(answerId);
    if (answerBox) {
        answerBox.classList.add('show');
        // تمرير إلى الإجابة إذا كانت مخفية جزئياً
        answerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// الانتقال لشريحة معينة
function goToSlide(slideNum) {
    if (slideNum >= 0 && slideNum < totalSlides) {
        document.querySelector('.slide.active').classList.remove('active');
        currentSlide = slideNum;
        document.getElementById('slide' + (currentSlide + 1)).classList.add('active');
        updateProgress();
    }
}

// حفظ التقدم في localStorage
function saveProgress() {
    localStorage.setItem('osManagementPresentation', JSON.stringify({
        slide: currentSlide,
        timestamp: new Date().getTime()
    }));
}

// تحميل التقدم السابق
function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem('osManagementPresentation'));
        if (saved && saved.slide !== undefined) {
            // تحقق إذا كان أقل من 24 ساعة
            const now = new Date().getTime();
            if (now - saved.timestamp < 24 * 60 * 60 * 1000) {
                goToSlide(saved.slide);
            }
        }
    } catch (e) {
        console.log('لا توجد بيانات محفوظة');
    }
}

// عند الخروج
window.addEventListener('beforeunload', saveProgress);

// تحميل التقدم عند البدء
setTimeout(loadProgress, 100);