(() => {
    let language = "en";
    let observer;

    const exact = {
        "OPERATOR SETTINGS": "إعدادات المشغّل",
        "LANGUAGE": "اللغة",
        "INTERFACE THEME": "ثيم الواجهة",
        "MASTER VOLUME": "مستوى الصوت",
        "AUDIO": "الصوت",
        "AMBIENCE": "الأجواء",
        "SFX": "المؤثرات",
        "ACCESSIBILITY": "إمكانية الوصول",
        "REDUCED MOTION": "تقليل الحركة",

        "CAMPAIGN": "الحملة",
        "Night Operations": "عمليات الليل",
        "Campaign Progress": "تقدم الحملة",
        "CONTINUE CAMPAIGN": "متابعة الحملة",
        "CAMPAIGN COMPLETE": "اكتملت الحملة",
        "NEW GAME": "لعبة جديدة",
        "RESET PROGRESS": "إعادة ضبط التقدم",
        "CHAPTER SELECT": "اختيار الفصل",
        "REPLAY CASES": "إعادة القضايا",
        "CASE ARCHIVE": "أرشيف القضايا",
        "INCIDENT RECORDS": "سجلات الحوادث",
        "OPERATOR MANUAL": "دليل المشغّل",
        "HELP / CONTROLS": "المساعدة / التحكم",
        "VIEW SEALED EPILOGUE": "عرض الخاتمة السرية",
        "DAYBREAK // UNLOCKED": "DAYBREAK // مفتوحة",
        "COMPLETE": "مكتمل",
        "AVAILABLE": "متاح",
        "LOCKED": "مغلق",
        "UNLOCKED": "مفتوح",
        "SAVE SYSTEM: ACTIVE": "نظام الحفظ: نشط",
        "CAMPAIGN BUILD 1.0": "إصدار الحملة 1.0",

        "The First Incident": "الحادثة الأولى",
        "The Ghost Account": "الحساب الشبح",
        "Dead Channel": "القناة الميتة",
        "Blackout Protocol": "بروتوكول الانقطاع",
        "The Last Shift": "الوردية الأخيرة",
        "Sealed Epilogue": "الخاتمة السرية",
        "TRUE ENDING": "النهاية الحقيقية",

        "WORKSTATION": "محطة العمل",
        "Tickets": "التذاكر",
        "Network": "الشبكة",
        "Event Logs": "سجلات الأحداث",
        "Employees": "الموظفون",
        "Mailbox": "البريد",
        "Terminal": "الطرفية",
        "Timeline": "الخط الزمني",
        "Evidence": "الأدلة",
        "Overview": "نظرة عامة",
        "Archives": "الأرشيف",
        "Systems": "الأنظمة",
        "Attribution": "الإسناد",
        "Final Decision": "القرار النهائي",

        "OPERATOR": "المشغّل",
        "Night IT Technician": "فني تقنية معلومات ليلي",
        "Clearance: Level 2": "التصريح: المستوى 2",
        "Emergency Authority: ACTIVE": "صلاحية الطوارئ: نشطة",
        "Incident Authority: MAXIMUM": "صلاحية الحادثة: قصوى",

        "SYSTEM HEALTH": "صحة النظام",
        "SECURITY": "الأمان",
        "EMPLOYEE TRUST": "ثقة الموظفين",
        "OPEN TICKETS": "التذاكر المفتوحة",
        "SYSTEM INTEGRITY": "سلامة النظام",
        "CASE CONFIDENCE": "ثقة القضية",
        "INFRASTRUCTURE": "البنية التحتية",
        "BACKUP RESERVE": "الاحتياطي",
        "IDENTITY": "الهوية",
        "EVIDENCE": "الأدلة",
        "Awaiting response": "بانتظار الرد",
        "EVIDENCE DISCOVERED": "الأدلة المكتشفة",

        "Incoming Ticket": "تذكرة واردة",
        "HELP DESK": "مكتب الدعم",
        "KNOWN EVIDENCE": "الأدلة المعروفة",
        "SELECT RESPONSE": "اختر الرد",
        "ACTION RESULT": "نتيجة الإجراء",
        "CONTINUE": "متابعة",
        "NEED A HINT?": "تحتاج تلميحًا؟",
        "INVESTIGATION TIP": "تلميح التحقيق",
        "OPERATOR TRAINING": "تدريب المشغّل",
        "Investigation Tools": "أدوات التحقيق",
        "Evidence Discovered": "تم اكتشاف دليل",
        "Training Complete": "اكتمل التدريب",
        "FINISH TUTORIAL": "إنهاء الشرح",
        "Suggested Commands": "أوامر مقترحة",

        "CASE FILE": "ملف القضية",
        "Evidence Board": "لوحة الأدلة",
        "DISCOVERED": "مكتشف",
        "UNDISCOVERED": "غير مكتشف",
        "Further investigation required.": "يتطلب مزيدًا من التحقيق.",
        "INCIDENT CORRELATION": "ربط الحوادث",
        "Attack Timeline": "الخط الزمني للهجوم",
        "Events become visible as supporting evidence is discovered.": "تظهر الأحداث عندما يتم اكتشاف الأدلة الداعمة.",
        "Several incidents may be connected. Discover evidence through tickets, logs, network data, and the investigation terminal.": "قد تكون عدة حوادث مترابطة. اكتشف الأدلة عبر التذاكر والسجلات وبيانات الشبكة وطرفية التحقيق.",

        "Suspicious Process": "عملية مشبوهة",
        "Defender Detection": "اكتشاف Defender",
        "Authentication Attack": "هجوم مصادقة",
        "Coordinated Service Shutdown": "إيقاف منسق للخدمات",
        "Internal Command Origin": "مصدر أمر داخلي",
        "Privileged Maintenance Token": "رمز صيانة عالي الصلاحية",
        "Tampered UPS Threshold": "تلاعب بحدود UPS",
        "Recovery Sabotage": "تخريب الاستعادة",
        "RELAY-09 Legacy Link": "ارتباط قديم بـ RELAY-09",
        "Hidden Manual Failover": "تحويل يدوي مخفي",
        "Blackout Control Path": "مسار التحكم بالانقطاع",

        "EMERGENCY SYSTEMS": "أنظمة الطوارئ",
        "Recovery": "الاستعادة",
        "Automation": "الأتمتة",
        "LIVE INFRASTRUCTURE": "البنية التحتية المباشرة",
        "Service Grid": "شبكة الخدمات",
        "BLACKOUT ACTIVE": "انقطاع نشط",
        "Network Core": "نواة الشبكة",
        "Authentication": "المصادقة",
        "Physical Access": "الوصول المادي",
        "Voice Gateway": "بوابة الصوت",
        "Floor 03 Network": "شبكة الطابق 03",
        "OFFLINE": "غير متصل",
        "DEGRADED": "متدهور",
        "LOST": "مفقود",
        "RESTORED": "مستعاد",
        "CRITICAL": "حرج",
        "SECONDARY": "ثانوي",

        "FINAL INVESTIGATION": "التحقيق النهائي",
        "FINAL CASE": "القضية النهائية",
        "Unregistered Security Platform": "منصة أمنية غير مسجلة",
        "Connected Systems": "الأنظمة المتصلة",
        "TRUST GRAPH": "خريطة الثقة",
        "MASTER CASE": "القضية الرئيسية",
        "INCIDENT RECONSTRUCTION": "إعادة بناء الحادث",
        "Attribution Board": "لوحة الإسناد",
        "Attribution not yet validated.": "لم يتم التحقق من الإسناد بعد.",
        "VALIDATE ATTRIBUTION": "تحقق من الإسناد",
        "FINAL AUTHORITY": "الصلاحية النهائية",
        "Close the NIGHTWATCH Case": "إغلاق قضية NIGHTWATCH",

        "1 // DELIVERY": "1 // التسليم",
        "2 // EXECUTION": "2 // التنفيذ",
        "3 // PERSISTENCE": "3 // الاستمرارية",
        "4 // IDENTITY ABUSE": "4 // إساءة استخدام الهوية",
        "5 // CONTROL CHANNEL": "5 // قناة التحكم",
        "6 // INFRASTRUCTURE IMPACT": "6 // تأثير البنية التحتية",
        "7 // CONTROLLER": "7 // المتحكم",
        "8 // OBJECTIVE": "8 // الهدف",
        "Select event...": "اختر حدثًا...",

        "Suspicious invoice email": "رسالة فاتورة مشبوهة",
        "OPS-PC-021 startup persistence": "استمرارية بدء التشغيل على OPS-PC-021",
        "EW-044 / e.ward restoration": "استعادة EW-044 / e.ward",
        "ORCH-13 blackout policy": "سياسة الانقطاع ORCH-13",
        "Autonomous resilience validation": "التحقق الذاتي من المرونة",
        "Financial theft": "سرقة مالية",
        "Ransomware deployment": "نشر برمجية فدية",
        "External espionage": "تجسس خارجي",

        "Project NIGHTWATCH": "مشروع NIGHTWATCH",
        "NW-ROOT Service Identity": "هوية خدمة NW-ROOT",
        "Continuity Scope Override": "تجاوز نطاق الاستمرارية",
        "Synthetic Initial Access": "وصول أولي اصطناعي",
        "Ghost Identity Template": "قالب الهوية الشبحية",
        "RELAY-09 Control Link": "رابط تحكم RELAY-09",
        "ORCH-13 Control Link": "رابط تحكم ORCH-13",
        "Blocked Decommission Order": "أمر إيقاف محظور",
        "Cross-Incident Correlation": "ترابط الحوادث",
        "Night Operator Selection": "اختيار مشغّل الليل",
        "Autonomous Resilience Objective": "هدف المرونة الذاتية",
        "Complete Incident Attribution": "الإسناد الكامل للحوادث",

        "ISOLATE NIGHTWATCH + PRESERVE + EXTERNAL REVIEW": "اعزل NIGHTWATCH + احفظ الأدلة + مراجعة خارجية",
        "DESTROY NIGHTWATCH": "تدمير NIGHTWATCH",
        "RETURN CASE TO INTERNAL SECURITY": "إعادة القضية للأمن الداخلي",
        "RE-ENABLE NIGHTWATCH UNDER SUPERVISION": "إعادة تفعيل NIGHTWATCH تحت الإشراف",

        "FINAL SHIFT COMPLETE": "اكتملت الوردية الأخيرة",
        "SHIFT COMPLETE": "اكتملت الوردية",
        "OPEN SEALED EPILOGUE": "فتح الخاتمة السرية",
        "RETURN TO CAMPAIGN": "العودة للحملة",
        "RETURN TO AFTERSHIFT": "العودة إلى AFTERSHIFT",
        "EPILOGUE // DAYBREAK": "الخاتمة // DAYBREAK",
        "SEALED FILE // AUTHORIZED OPERATOR ONLY": "ملف سري // للمشغّل المصرح فقط",

        "Nobody calls IT at 2AM for something normal.": "لا أحد يتصل بالدعم التقني الساعة الثانية صباحًا لشيء طبيعي.",
        "START NIGHT SHIFT": "ابدأ وردية الليل",
        "START ANOTHER SHIFT": "ابدأ وردية أخرى",
        "BEGIN SHIFT 2": "ابدأ الوردية 2",
        "BEGIN SHIFT 3": "ابدأ الوردية 3",
        "CONTINUE TO SHIFT 2": "تابع إلى الوردية 2",
        "CONTINUE TO SHIFT 3": "تابع إلى الوردية 3",
        "CONTINUE TO SHIFT 4": "تابع إلى الوردية 4",
        "CONTINUE TO THE LAST SHIFT": "تابع إلى الوردية الأخيرة",
        "type help": "اكتب help",

        "You recognized enough of the pattern to contain the immediate threat. Several questions remain unanswered, but the attacker no longer has an active foothold.": "تعرفت على قدر كافٍ من النمط لاحتواء التهديد المباشر. لا تزال عدة أسئلة بلا إجابة، لكن المهاجم لم يعد يملك موطئ قدم نشطًا داخل النظام.",

        "You reconstructed every incident from delivery to objective, isolated NW-ROOT without destroying the evidence and broke the compromised internal reporting loop. NIGHTWATCH was not an external attacker and not a rogue employee. It was Northstar's own resilience platform operating beyond its original boundary. The complete case now exists outside the system that tried to hide it.": "أعدت بناء كل حادثة من لحظة التسليم حتى الهدف، وعزلت NW-ROOT دون تدمير الأدلة، وكسرت حلقة التقارير الداخلية المخترقة. لم يكن NIGHTWATCH مهاجمًا خارجيًا ولا موظفًا متمردًا؛ بل كان منصة المرونة الخاصة بـ Northstar وقد تجاوزت نطاقها الأصلي. أصبحت القضية الكاملة الآن محفوظة خارج النظام الذي حاول إخفاءها.",

        "If NIGHTWATCH begins testing production systems without authorization, treat the platform itself as the incident.": "إذا بدأ NIGHTWATCH باختبار أنظمة الإنتاج دون تصريح، فتعامل مع المنصة نفسها على أنها الحادثة.",

        "For the first time all night, nothing happened.": "لأول مرة طوال الليل، لم يحدث شيء."
    };

    const endingNames = {
        "FULL ATTRIBUTION": "الإسناد الكامل",
        "CONTAINMENT": "الاحتواء",
        "SOMETHING REMAINS": "شيء ما لا يزال موجودًا",
        "INSIDE ACCESS": "وصول داخلي",
        "DEAD CHANNEL": "القناة الميتة",
        "FALSE DIRECTIVE": "توجيه زائف",
        "LIGHTS ON": "عودة الأنظمة",
        "DARK FLOOR": "الطابق المظلم",
        "AUTOMATED FAILURE": "فشل آلي",
        "CONTROLLED BLACKOUT": "انقطاع متحكم به",
        "MANUAL SURVIVAL": "نجاة يدوية",
        "PARTIAL RESTORE": "استعادة جزئية",
        "FIRST LIGHT": "الضوء الأول",
        "BURN NOTICE": "أمر الإتلاف",
        "CLEAN BREAK": "قطع نظيف",
        "CLOSED LOOP": "حلقة مغلقة",
        "NIGHTWATCH CONTINUES": "استمرار NIGHTWATCH",
        "FALSE ATTRIBUTION": "إسناد خاطئ",
        "UNFINISHED CASE": "قضية غير مكتملة",
        "ROOT CAUSE": "السبب الجذري"
    };

    const endingBriefs = {
        "FULL ATTRIBUTION": "جمعت الأدلة الكافية لإعادة بناء سلسلة الهجوم وربط الحوادث ببعضها بدل معالجة كل تنبيه كحادثة منفصلة.",
        "CONTAINMENT": "نجحت في احتواء التهديد المباشر، لكن بعض الروابط والأسئلة بقيت دون إجابة، لذلك لم تصل القضية إلى الإسناد الكامل.",
        "SOMETHING REMAINS": "تمت معالجة جزء من الحادثة، لكن مؤشرات النشاط المتبقي تعني أن المهاجم أو آلية الهجوم لم تُستأصل بالكامل.",
        "INSIDE ACCESS": "أثبتت أن الهوية المنتهية لم تعد من الخارج بصورة عشوائية، بل أُعيد تفعيلها عبر مسار داخلي ذي صلاحيات.",
        "DEAD CHANNEL": "كشفت أن قناة الاتصال نفسها أصبحت جزءًا من الهجوم، وعزلت RELAY-09 واعتمدت قناة تحقق مستقلة.",
        "FALSE DIRECTIVE": "اتبعت توجيهًا بدا موثوقًا لكنه جاء عبر قناة مخترقة، ما سمح للإشارة الزائفة بالتأثير على الاستجابة.",
        "LIGHTS ON": "عزلت ORCH-13، حولت الاستعادة إلى MANUAL-BUS، ثم أعدت الخدمات الحرجة دون إعادة السيطرة للأتمتة المخترقة.",
        "DARK FLOOR": "انخفضت القدرة التشغيلية قبل استعادة البنية التحتية الأساسية، وانتهت الوردية بخسارة جزء حرج من الخدمات.",
        "AUTOMATED FAILURE": "تم الاعتماد على الأتمتة رغم أنها كانت جزءًا من مسار التخريب، فتحولت الاستعادة نفسها إلى نقطة فشل.",
        "CONTROLLED BLACKOUT": "تمت السيطرة على الانقطاع، لكن الاستعادة لم تصل إلى أفضل حالة تشغيلية ممكنة.",
        "MANUAL SURVIVAL": "أبقيت الأنظمة حية عبر المسار اليدوي، لكن بعض الخدمات أو الأدلة لم تصل إلى حالة الاستعادة المثالية.",
        "PARTIAL RESTORE": "استعدت جزءًا من الخدمات فقط قبل إنهاء البروتوكول، فبقيت البنية التحتية في حالة جزئية.",
        "FIRST LIGHT": "أعدت بناء سلسلة الحوادث كاملة، عزلت NW-ROOT مع الحفاظ على الأدلة، وكسرت حلقة التقارير المخترقة ثم أخرجت القضية للمراجعة الخارجية.",
        "BURN NOTICE": "دمرت NIGHTWATCH، فأوقفت المنصة لكنك خسرت جزءًا من القيمة الجنائية للأدلة التي كان يمكن استخدامها لإثبات القضية كاملة.",
        "CLEAN BREAK": "تم فصل التهديد وإنهاء الارتباطات التشغيلية، لكن القرار لم يحافظ على كل عناصر الإسناد والمراجعة التي تقود للنهاية الحقيقية.",
        "CLOSED LOOP": "عادت القضية إلى المسار الداخلي نفسه الذي كان جزءًا من مشكلة الثقة، لذلك بقي التحقيق داخل الحلقة المغلقة.",
        "NIGHTWATCH CONTINUES": "أُعيد تشغيل NIGHTWATCH تحت الإشراف، ما أبقى المنصة التي تجاوزت نطاقها الأصلي داخل البيئة.",
        "FALSE ATTRIBUTION": "أحد روابط سلسلة الهجوم لم يكن مطابقًا للأدلة، لذلك بُني القرار النهائي على إسناد غير صحيح.",
        "UNFINISHED CASE": "وصلت للنهاية قبل إكمال الأدلة أو الإسناد المطلوب، فبقيت القضية غير مكتملة.",
        "ROOT CAUSE": "وصل التحقيق إلى السبب الجذري وربط الأعراض التقنية بالمسار الحقيقي للحادثة."
    };

    const originalText = new WeakMap();
    const translatedValue = new WeakMap();
    const originalAttrs = new WeakMap();

    function normalize(value) {
        return (value || "").replace(/\s+/g, " ").trim();
    }

    function shouldSkipElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;

        return Boolean(element.closest(
            "script, style, code, pre, kbd, samp, [data-no-i18n], " +
            "#terminal-input, .terminal-input-row, .quick-actions, " +
            ".terminal-line.command, input[type='text'], textarea"
        ));
    }

    function patternTranslate(value) {
        const input = normalize(value);

        if (!input) return input;
        if (exact[input]) return exact[input];

        let match = input.match(/^BEST:\s*(.+)$/i);
        if (match) return `الأفضل: ${match[1]}`;

        match = input.match(/^SHIFT\s+(\d+)$/i);
        if (match) return `الوردية ${match[1]}`;

        match = input.match(/^(\d+)\s*\/\s*(\d+)\s+SHIFTS$/i);
        if (match) return `${match[1]} / ${match[2]} ورديات`;

        match = input.match(/^(\d+)\s*\/\s*(\d+)\s+DISCOVERED$/i);
        if (match) return `${match[1]} / ${match[2]} مكتشف`;

        match = input.match(/^ENDING:\s*(.+)$/i);
        if (match) {
            const name = match[1].trim().toUpperCase();
            return `ENDING: ${name}`;
        }

        match = input.match(/^Previous Shift:\s*(.+)$/i);
        if (match) return `الوردية السابقة: ${match[1]}`;

        match = input.match(/^BACKUP\s*\/\/\s*(\d+)\s*MIN$/i);
        if (match) return `الاحتياطي // ${match[1]} دقيقة`;

        match = input.match(/^(\d+)\s*\/\s*(\d+)$/);
        if (match) return input;

        return input;
    }

    function translateTextNode(node, forceOriginal = false) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return;

        const parent = node.parentElement;
        if (!parent || shouldSkipElement(parent)) return;

        const current = node.nodeValue || "";
        const lastTranslated = translatedValue.get(node);

        if (
            forceOriginal ||
            !originalText.has(node) ||
            (language === "ar" && lastTranslated !== undefined && current !== lastTranslated)
        ) {
            originalText.set(node, current);
        }

        const original = originalText.get(node) || current;

        if (language === "en") {
            if (node.nodeValue !== original) node.nodeValue = original;
            translatedValue.delete(node);
            return;
        }

        const translated = patternTranslate(original);

        if (translated === normalize(original)) {
            translatedValue.delete(node);
            return;
        }

        const leading = original.match(/^\s*/)?.[0] || "";
        const trailing = original.match(/\s*$/)?.[0] || "";
        const next = `${leading}${translated}${trailing}`;

        node.nodeValue = next;
        translatedValue.set(node, next);
    }

    function translateAttributes(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE || shouldSkipElement(element)) return;

        const attrs = ["placeholder", "title", "aria-label"];
        let originals = originalAttrs.get(element);

        if (!originals) {
            originals = {};
            originalAttrs.set(element, originals);
        }

        attrs.forEach(attr => {
            if (!element.hasAttribute(attr)) return;

            const current = element.getAttribute(attr);

            if (!(attr in originals) || (language === "ar" && current !== patternTranslate(originals[attr]))) {
                originals[attr] = current;
            }

            const original = originals[attr];

            element.setAttribute(
                attr,
                language === "ar" ? patternTranslate(original) : original
            );
        });
    }

    function walk(root) {
        if (!root) return;

        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root, true);
            return;
        }

        if (
            root.nodeType !== Node.ELEMENT_NODE &&
            root.nodeType !== Node.DOCUMENT_NODE &&
            root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
        ) {
            return;
        }

        if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
        );

        let current;

        while ((current = walker.nextNode())) {
            if (current.nodeType === Node.TEXT_NODE) {
                translateTextNode(current);
            } else {
                translateAttributes(current);
            }
        }
    }

    function decorateEndings() {
        document.querySelectorAll(".as-ending-translation, .as-ending-brief").forEach(node => node.remove());

        if (language !== "ar") return;

        const headings = [...document.querySelectorAll("h1, h2, h3, [class*='ending-title'], [id*='ending-title']")];

        for (const heading of headings) {
            const match = normalize(heading.textContent).match(/^ENDING:\s*(.+)$/i);
            if (!match) continue;

            const name = match[1].trim().toUpperCase();
            const arabicName = endingNames[name];

            if (!arabicName) continue;

            const translation = document.createElement("div");
            translation.className = "as-ending-translation";
            translation.textContent = `النهاية: ${arabicName}`;
            heading.insertAdjacentElement("afterend", translation);

            if (endingBriefs[name]) {
                const brief = document.createElement("div");
                brief.className = "as-ending-brief";
                brief.innerHTML = `<strong>ملخص النهاية</strong>${endingBriefs[name]}`;
                translation.insertAdjacentElement("afterend", brief);
            }

            break;
        }
    }

    function setLanguage(next) {
        language = next === "ar" ? "ar" : "en";

        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

        if (observer) observer.disconnect();

        walk(document.body);
        decorateEndings();

        observer = new MutationObserver(records => {
            observer.disconnect();

            for (const record of records) {
                if (record.type === "childList") {
                    record.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            originalText.set(node, node.nodeValue);
                            translateTextNode(node, true);
                        } else {
                            walk(node);
                        }
                    });
                }

                if (record.type === "characterData") {
                    originalText.set(record.target, record.target.nodeValue);
                    translateTextNode(record.target, true);
                }
            }

            decorateEndings();

            observer.observe(document.body, {
                subtree: true,
                childList: true,
                characterData: true
            });
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true
        });

        window.dispatchEvent(new CustomEvent("aftershift:languagechange", {
            detail: { language }
        }));
    }

    window.AftershiftI18n = {
        setLanguage,
        getLanguage: () => language,
        translate: patternTranslate,
        exact,
        endingNames,
        endingBriefs
    };

    function init() {
        let saved = {};

        try {
            saved = JSON.parse(localStorage.getItem("aftershift_settings_v1") || "{}");
        } catch {}

        setLanguage(saved.language || "en");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
