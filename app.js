try {
    const menuBtn = document.getElementById('hamburger');
    const mainMenu = document.getElementById('mainMenu');
    if (menuBtn && mainMenu) {
        menuBtn.addEventListener('click', () => {
            mainMenu.classList.toggle('hidden');
            mainMenu.setAttribute('aria-hidden', mainMenu.classList.contains('hidden') ? 'true' : 'false');
        });
    }

    document.querySelectorAll('#mainMenu a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const page = a.dataset.page;
            showPage(page);
            if (mainMenu) mainMenu.classList.add('hidden');
        });
    });

    // All topics, digraph SVG and matrices, unchanged...
    const repTopics = [
        // ... (rest of topics as before, including digraph topic showing rel_digraph.svg) ...
        {
            id: "digraph",
            label: "Digraphs & Arrow Diagrams",
            content: `
<h2>Digraphs & Arrow Diagrams</h2>
<p>Relations can be visualized as directed graphs (digraphs), with elements as nodes and arrows for each pair (a,b) ∈ R.</p>
<img src="assets/images/rel_digraph.svg" alt="Relation Digraph" style="max-width:250px; display:block; margin:18px auto 2px auto;">
<small style="display:block; text-align:center; color:#cfeff8;">Example: Digraph for R = {(1,2), (2,3)}</small>
`
        }
        // ... (other topics unchanged) ...
    ];

    function renderTopicButtons() {
        const topicsList = document.getElementById('topicsList');
        topicsList.innerHTML = '';
        repTopics.forEach(topic => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '8px';

            const btn = document.createElement('button');
            btn.className = 'topic-btn';
            btn.dataset.topic = topic.id;
            btn.innerText = topic.label;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'topic-content-inline';
            contentDiv.style.display = 'none';

            btn.onclick = function() {
                document.querySelectorAll('.topic-content-inline').forEach(div => {
                    div.style.display = 'none';
                    div.innerHTML = '';
                });
                contentDiv.innerHTML = topic.content;
                contentDiv.style.display = 'block';
                contentDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };

            wrapper.appendChild(btn);
            wrapper.appendChild(contentDiv);
            topicsList.appendChild(wrapper);
        });
    }

    let currentCategory = 'input';
    function showPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        const el = document.getElementById(page);
        if (el) {
            el.classList.remove('hidden');
            el.scrollIntoView({ behavior: 'smooth' });
        }
        if (page === 'topics') renderTopicButtons();
        if (page === 'tools') initMatrixTool();
        if (page === 'quiz') loadQuiz();
    }

    // Integrated: Matrix Tool instruction definition box
    function initMatrixTool() {
        // Add definitions/instructions at the top
        const desc = document.getElementById('toolDescription');
        if (desc) {
            desc.innerHTML = `
<div class="tool-info-box">
  <h3 style="margin-top:4px;">How to use the Matrix Tool</h3>
  <ul>
    <li>Enter your relation as ordered pairs in parentheses, separated by commas.<br>
      <small>Example: <code>(1,2),(2,3),(2,1)</code></small></li>
    <li>Click <b>Show Matrix</b> to view the zero-one matrix for your relation — showing which elements are related.</li>
    <li>To start fresh, click <b>New Matrix</b>.</li>
    <li>Switch categories (Input/Closure) using the sidebar — the Closure tab is for future updates.</li>
    <li><b>Tip:</b> This tool is for learning how relations are represented as matrices in Discrete Math.</li>
  </ul>
</div>
            `;
        }

        const matrixList = document.getElementById('matrixList');
        const matrixBtn = document.getElementById('matrixBtn');
        const matrixInput = document.getElementById('matrixInput');
        const newMatrixBtn = document.getElementById('newMatrixBtn');
        const noMatrixMsg = document.getElementById('noMatrixMsg');

        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                currentCategory = item.dataset.category;
                renderMatrix();
            });
        });

        if (newMatrixBtn) {
            newMatrixBtn.onclick = () => {
                matrixInput.value = '';
                matrixList.innerHTML = '';
                if (noMatrixMsg) noMatrixMsg.style.display = 'block';
            };
        }

        if (matrixBtn && matrixInput) {
            matrixBtn.onclick = () => {
                const input = matrixInput.value;
                const pairs = input.match(/\(([^)]+)\)/g);
                if (!pairs || !pairs.length) {
                    matrixList.innerHTML = '<p>Enter at least one pair like (1,2),(2,3)</p>';
                    if (noMatrixMsg) noMatrixMsg.style.display = 'none';
                    return;
                }
                let elements = new Set();
                let relPairs = [];
                pairs.forEach(pair => {
                    let nums = pair.replace(/[()]/g, '').split(',');
                    if (nums.length === 2) {
                        elements.add(nums[0].trim());
                        elements.add(nums[1].trim());
                        relPairs.push(nums.map(x => x.trim()));
                    }
                });
                elements = Array.from(elements).sort();
                let html = '<table><tr><th></th>' + elements.map(e => `<th>${e}</th>`).join('') + '</tr>';
                elements.forEach(row => {
                    html += `<tr><td>${row}</td>`;
                    elements.forEach(col => {
                        let found = relPairs.some(([r, c]) => r === row && c === col);
                        html += `<td>${found ? '1' : '0'}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</table>';
                matrixList.innerHTML = html;
                if (noMatrixMsg) noMatrixMsg.style.display = 'none';
            };
        }

        renderMatrix();
    }

    function renderMatrix() {
        const matrixList = document.getElementById('matrixList');
        const noMatrixMsg = document.getElementById('noMatrixMsg');
        if (currentCategory === 'input') {
            matrixList.innerHTML = '';
            if (noMatrixMsg) noMatrixMsg.style.display = 'block';
        } else {
            matrixList.innerHTML = '<p>Closure features coming soon!</p>';
        }
    }

    const quizQuestions = [
        { q: 'Which is a way to represent a relation?', opts: ['Set of pairs', 'Digraph', 'Matrix', 'All of the above'], a: 3 },
        { q: 'The reflexive closure of R on {1,2} adds which pair?', opts: ['(1,2)', '(2,1)', '(1,1) and (2,2)', 'None'], a: 2 },
        { q: 'If (1,2) is in R, which pair is added in symmetric closure?', opts: ['(2,1)', '(1,1)', '(2,2)', 'None'], a: 0 },
        { q: 'Which closure adds (a,c) when (a,b) and (b,c) are in R?', opts: ['Reflexive', 'Symmetric', 'Transitive', 'None'], a: 2 },
        { q: 'Matrix entry M[2][3] = 1 means?', opts: ['Relation from 2 to 3', 'Relation from 3 to 2', 'No relation', 'Unknown'], a: 0 }
    ];

    function loadQuiz() {
        const area = document.getElementById('quizArea');
        if (!area) return;
        area.innerHTML = '';
        quizQuestions.forEach((qq, idx) => {
            const div = document.createElement('div'); div.className = 'quiz-card';
            div.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${qq.q}</p>`;
            qq.opts.forEach((opt, i) => {
                const btn = document.createElement('button'); btn.innerText = opt;
                btn.onclick = () => {
                    if (i === qq.a) alert('Correct!');
                    else alert('Incorrect!');
                };
                div.appendChild(btn);
            });
            area.appendChild(div);
        });
    }

    showPage('home');
} catch (error) {
    console.error('Error:', error);
}
