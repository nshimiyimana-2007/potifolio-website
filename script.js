(function() {
  // Custom cursor animation
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  
  // Hover effect for interactive elements
  document.querySelectorAll('a, button, .click-to-copy').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '56px';
      ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });
  
  // Particle system
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1
    });
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,200,${p.alpha})`;
      ctx.fill();
    });
    
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,240,200,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
  
  // Typing animation for hero role
  const roles = ['Full-Stack Dev', 'PHP Expert', 'Node.js Builder', 'Coop Systems'];
  let ri = 0, ci = 0, del = false;
  const typeEl = document.getElementById('typed-role');
  
  function type() {
    const word = roles[ri];
    if (!del) {
      typeEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        del = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      typeEl.textContent = word.slice(0, --ci);
      if (ci === 0) {
        del = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(type, del ? 60 : 100);
  }
  setTimeout(type, 1500);
  
  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.classList.contains('skill-card')) {
          e.target.querySelector('.skill-bar').style.transform = 'scaleX(1)';
        }
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  // Toast notification for copy functionality
  const toast = document.getElementById('toast');
  
  function showToast(msg) {
    toast.textContent = msg || 'Copied!';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2000);
  }
  
  // Copy to clipboard functionality
  document.querySelectorAll('.click-to-copy').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = el.getAttribute('data-copy') || el.innerText.replace(/[📞📧\+]/g, '').trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied: ${textToCopy}`);
      }).catch(() => {
        showToast('Failed to copy');
      });
    });
  });
  
  // Prevent mail link from triggering copy twice
  const mailLink = document.querySelector('.contact-detail-item a');
  if (mailLink) {
    mailLink.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Initialize skill bars
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.transform = 'scaleX(0)';
  });
  
  // Image fallback handling
  const profileImg = document.getElementById('profileImage');
  if (profileImg && profileImg.complete && profileImg.naturalWidth === 0) {
    profileImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 500\'%3E%3Crect width=\'400\' height=\'500\' fill=\'%2312122a\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'20\' fill=\'%2300f0c8\' text-anchor=\'middle\' dy=\'.3em\'%3EARSENE%3C/text%3E%3C/svg%3E';
  }
})();