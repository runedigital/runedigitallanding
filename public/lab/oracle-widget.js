// ═══════════════════════════════════════════════════════════════
// THE ORACLE - Embeddable Enterprise Knowledge & Pricing Assistant
// Drop this script into any page to add The Oracle widget
// ═══════════════════════════════════════════════════════════════

(function() {
    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = `
        .oracle-trigger {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00ffea, #a855f7);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 255, 234, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
            z-index: 9999;
            animation: oracleFloat 3s ease-in-out infinite;
        }
        @keyframes oracleFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .oracle-trigger:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(0, 255, 234, 0.6);
        }
        .oracle-trigger.active { animation: none; transform: rotate(45deg); }
        .oracle-panel {
            position: fixed;
            bottom: 85px;
            right: 20px;
            width: 360px;
            max-height: 550px;
            background: #0d0d0d;
            border: 1px solid rgba(0, 255, 234, 0.3);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 9998;
            font-family: 'Inter', -apple-system, sans-serif;
        }
        .oracle-panel.open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: all;
        }
        .oracle-header {
            background: linear-gradient(135deg, rgba(0, 255, 234, 0.15), rgba(168, 85, 247, 0.15));
            padding: 15px;
            border-bottom: 1px solid #252525;
        }
        .oracle-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #00ffea, #a855f7);
        }
        .oracle-title-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .oracle-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00ffea, #a855f7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        .oracle-title { font-family: 'Oswald', sans-serif; font-size: 16px; letter-spacing: 2px; color: #00ffea; }
        .oracle-subtitle { font-size: 10px; color: #888; }
        .oracle-quick {
            padding: 10px;
            border-bottom: 1px solid #252525;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .oracle-quick-btn {
            padding: 6px 10px;
            border: 1px solid #252525;
            border-radius: 15px;
            background: rgba(255,255,255,0.02);
            color: #888;
            font-size: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .oracle-quick-btn:hover {
            background: rgba(0, 255, 234, 0.1);
            border-color: #00ffea;
            color: #00ffea;
        }
        .oracle-messages {
            height: 280px;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .oracle-msg {
            max-width: 85%;
            padding: 10px 12px;
            border-radius: 10px;
            font-size: 12px;
            line-height: 1.5;
            color: #fff;
        }
        .oracle-msg.bot {
            align-self: flex-start;
            background: linear-gradient(135deg, rgba(0, 255, 234, 0.1), rgba(168, 85, 247, 0.1));
            border: 1px solid rgba(0, 255, 234, 0.2);
        }
        .oracle-msg.user {
            align-self: flex-end;
            background: rgba(255,255,255,0.05);
            border: 1px solid #252525;
        }
        .oracle-msg ol { margin: 8px 0 0 15px; }
        .oracle-msg li { margin-bottom: 4px; }
        .oracle-msg .source { font-size: 9px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
        .oracle-price-box {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 234, 0.1));
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 8px;
            padding: 10px;
            margin-top: 8px;
        }
        .oracle-price-value { font-family: 'Oswald', sans-serif; font-size: 24px; color: #00ff88; }
        .oracle-price-breakdown { font-size: 10px; color: #888; margin-top: 4px; }
        .oracle-input-row {
            padding: 12px;
            border-top: 1px solid #252525;
            display: flex;
            gap: 8px;
            background: rgba(0,0,0,0.3);
        }
        .oracle-input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #252525;
            border-radius: 20px;
            background: #141414;
            color: #fff;
            font-size: 12px;
        }
        .oracle-input:focus { outline: none; border-color: #00ffea; }
        .oracle-input::placeholder { color: #666; }
        .oracle-send {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #00ffea, #a855f7);
            color: #000;
            font-size: 16px;
            cursor: pointer;
        }
        .oracle-send:hover { transform: scale(1.1); }
        .oracle-typing { display: flex; gap: 4px; padding: 10px; }
        .oracle-typing span {
            width: 6px; height: 6px; border-radius: 50%; background: #00ffea;
            animation: oracleBounce 1.4s infinite;
        }
        .oracle-typing span:nth-child(2) { animation-delay: 0.2s; }
        .oracle-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes oracleBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }
    `;
    document.head.appendChild(styles);

    // Create widget HTML
    const widget = document.createElement('div');
    widget.innerHTML = `
        <button class="oracle-trigger" id="oracleTrigger">🔮</button>
        <div class="oracle-panel" id="oraclePanel">
            <div class="oracle-header">
                <div class="oracle-title-row">
                    <div class="oracle-avatar">🔮</div>
                    <div>
                        <div class="oracle-title">THE ORACLE</div>
                        <div class="oracle-subtitle">Knowledge & Pricing Assistant</div>
                    </div>
                </div>
            </div>
            <div class="oracle-quick">
                <button class="oracle-quick-btn" data-q="Price 5g Premium item">🥇 Price item</button>
                <button class="oracle-quick-btn" data-q="How to test item?">🧪 Test item</button>
                <button class="oracle-quick-btn" data-q="Stocktake process">📋 Stocktake</button>
                <button class="oracle-quick-btn" data-q="Price 20g material">🪙 material</button>
            </div>
            <div class="oracle-messages" id="oracleMessages">
                <div class="oracle-msg bot">
                    👋 I'm The Oracle - ask me about pricing or processes!<br><br>
                    Try: "Price 10g Standard item" or "How to test item grade?"
                </div>
            </div>
            <div class="oracle-input-row">
                <input type="text" class="oracle-input" id="oracleInput" placeholder="Ask anything or price items...">
                <button class="oracle-send" id="oracleSend">→</button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // Pricing data
    const itemPrices = {
        'Standard': 120, '9k': 120, '10ct': 133, 'Enhanced': 187, '14k': 187,
        'Premium': 240, '18k': 240, '21ct': 280, 'Elite': 293, 'Ultra': 320,
        'platinum-tier': 110, 'plat': 110
    };

    // Knowledge base
    const knowledge = {
        item_test: {
            title: 'item Testing',
            steps: ['Get acid testing kit (Standard, Enhanced, Premium, Elite)', 'Rub item on testing stone', 'Apply Standard acid - if dissolves, not item', 'Test with higher acids until it survives', 'That determines the grade', 'Weigh and price using The Oracle!'],
            source: 'item Pricing Guide'
        },
        stocktake: {
            title: 'Stocktake Process',
            steps: ['Print stocktake sheets', 'Scan each barcode', 'Verify item matches', 'Flag missing items', 'Submit to manager', 'Reconcile before EOD'],
            source: 'Stocktake Process Guide'
        },
        repair: {
            title: 'Repairs Process',
            steps: ['Assess repair with customer', 'Take photos', 'Quote using price list', 'Take deposit if >$100', 'Log in system', 'Send to jeweller'],
            source: 'Repairs & Valuations Guide'
        }
    };

    function parsePrice(q) {
        q = q.toLowerCase();
        const weightMatch = q.match(/(\d+\.?\d*)\s*(g|gram)/);
        const gradeMatch = q.match(/(\d+)\s*(ct|k|grade)/);
        const weight = weightMatch ? parseFloat(weightMatch[1]) : null;
        
        if (q.includes('material') && weight) {
            return { total: weight * 10, breakdown: `${weight}g × $10/g (Sterling 925)` };
        }
        if ((q.includes('item') || gradeMatch) && weight) {
            const grade = gradeMatch ? gradeMatch[1] + 'ct' : 'Standard';
            const rate = itemPrices[grade] || 120;
            return { total: weight * rate, breakdown: `${weight}g × $${rate}/g (${grade.toUpperCase()})` };
        }
        if (q.includes('platinum-tier') && weight) {
            return { total: weight * 110, breakdown: `${weight}g × $110/g (platinum-tier)` };
        }
        return null;
    }

    function getResponse(q) {
        q = q.toLowerCase();
        
        // Try pricing first
        if (q.includes('price') || q.includes('worth') || q.match(/\d+\s*g/)) {
            const price = parsePrice(q);
            if (price) {
                return `<div class="oracle-msg bot">💰 <strong>Calculated Price:</strong><div class="oracle-price-box"><div class="oracle-price-value">$${price.total.toFixed(2)}</div><div class="oracle-price-breakdown">${price.breakdown}</div></div><div class="source">Based on Enterprise pricing rates</div></div>`;
            }
        }
        
        // Knowledge queries
        if (q.includes('test') || q.includes('grade') || q.includes('acid')) {
            const k = knowledge.item_test;
            return `<div class="oracle-msg bot"><strong>${k.title}</strong><ol>${k.steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="source">📚 ${k.source}</div></div>`;
        }
        if (q.includes('stocktake') || q.includes('inventory')) {
            const k = knowledge.stocktake;
            return `<div class="oracle-msg bot"><strong>${k.title}</strong><ol>${k.steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="source">📚 ${k.source}</div></div>`;
        }
        if (q.includes('repair') || q.includes('fix')) {
            const k = knowledge.repair;
            return `<div class="oracle-msg bot"><strong>${k.title}</strong><ol>${k.steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="source">📚 ${k.source}</div></div>`;
        }
        
        // Help
        if (q.includes('item')) {
            return `<div class="oracle-msg bot">🥇 <strong>item Pricing</strong><br><br>Tell me weight and grade:<br>• "Price 5g Premium item"<br><br><strong>Rates:</strong> Standard $120/g | Enhanced $187/g | Premium $240/g</div>`;
        }
        
        return `<div class="oracle-msg bot">Try:<br>• 💰 "Price 5g Premium item"<br>• 🧪 "How to test item?"<br>• 📋 "Stocktake process"</div>`;
    }

    // Event handlers
    const trigger = document.getElementById('oracleTrigger');
    const panel = document.getElementById('oraclePanel');
    const input = document.getElementById('oracleInput');
    const messages = document.getElementById('oracleMessages');

    trigger.onclick = () => {
        trigger.classList.toggle('active');
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) input.focus();
    };

    document.querySelectorAll('.oracle-quick-btn').forEach(btn => {
        btn.onclick = () => {
            input.value = btn.dataset.q;
            document.getElementById('oracleSend').click();
        };
    });

    document.getElementById('oracleSend').onclick = () => {
        const q = input.value.trim();
        if (!q) return;
        messages.innerHTML += `<div class="oracle-msg user">${q}</div>`;
        input.value = '';
        messages.innerHTML += `<div class="oracle-typing" id="typing"><span></span><span></span><span></span></div>`;
        messages.scrollTop = messages.scrollHeight;
        setTimeout(() => {
            document.getElementById('typing')?.remove();
            messages.innerHTML += getResponse(q);
            messages.scrollTop = messages.scrollHeight;
        }, 600);
    };

    input.onkeypress = (e) => { if (e.key === 'Enter') document.getElementById('oracleSend').click(); };
})();
