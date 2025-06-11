// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Введение</a></li><li class="chapter-item expanded affix "><a href="sql-demo.html">🎮 Демо: Интерактивные SQL запросы</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Организация курса</li><li class="chapter-item expanded "><a href="docs/course-structure.html"><strong aria-hidden="true">1.</strong> Структура курса</a></li><li class="chapter-item expanded "><a href="docs/installation-guide.html"><strong aria-hidden="true">2.</strong> Установка и настройка</a></li><li class="chapter-item expanded "><a href="docs/interactive-sql-guide.html"><strong aria-hidden="true">3.</strong> Интерактивные SQL блоки</a></li><li class="chapter-item expanded "><a href="docs/webinars-schedule.html"><strong aria-hidden="true">4.</strong> Расписание вебинаров</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Модули курса</li><li class="chapter-item expanded "><a href="modules/00-introduction/index.html"><strong aria-hidden="true">5.</strong> Обзор модуля</a></li><li class="chapter-item expanded "><a href="modules/00-introduction/theory/index.html"><strong aria-hidden="true">6.</strong> Теория</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/00-introduction/theory/01-why-sql-for-developers.html"><strong aria-hidden="true">6.1.</strong> Зачем разработчику SQL?</a></li><li class="chapter-item "><a href="modules/00-introduction/theory/02-real-world-examples.html"><strong aria-hidden="true">6.2.</strong> Примеры из реальной разработки</a></li><li class="chapter-item "><a href="modules/00-introduction/theory/03-first-queries.html"><strong aria-hidden="true">6.3.</strong> Первые запросы</a></li></ol></li><li class="chapter-item expanded "><a href="modules/00-introduction/practice/index.html"><strong aria-hidden="true">7.</strong> Практика</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/00-introduction/practice/exercises/01-first-queries.html"><strong aria-hidden="true">7.1.</strong> Упражнения</a></li><li class="chapter-item "><a href="modules/00-introduction/practice/solutions/index.html"><strong aria-hidden="true">7.2.</strong> Решения</a></li></ol></li><li class="chapter-item expanded "><a href="modules/01-sql-basics/index.html"><strong aria-hidden="true">8.</strong> Обзор модуля</a></li><li class="chapter-item expanded "><a href="modules/01-sql-basics/theory/index.html"><strong aria-hidden="true">9.</strong> Теория</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/01-sql-basics/theory/01-postgresql-architecture.html"><strong aria-hidden="true">9.1.</strong> Устройство PostgreSQL</a></li><li class="chapter-item "><a href="modules/01-sql-basics/theory/02-ddl-basics.html"><strong aria-hidden="true">9.2.</strong> Основы SQL: DDL</a></li><li class="chapter-item "><a href="modules/01-sql-basics/theory/03-dml-basics.html"><strong aria-hidden="true">9.3.</strong> Основы SQL: DML</a></li><li class="chapter-item "><a href="modules/01-sql-basics/theory/04-normalization.html"><strong aria-hidden="true">9.4.</strong> Нормализация БД</a></li><li class="chapter-item "><a href="modules/01-sql-basics/theory/05-relationships.html"><strong aria-hidden="true">9.5.</strong> Связи между таблицами</a></li><li class="chapter-item "><a href="modules/01-sql-basics/theory/06-joins.html"><strong aria-hidden="true">9.6.</strong> JOIN операции</a></li></ol></li><li class="chapter-item expanded "><a href="modules/01-sql-basics/practice/index.html"><strong aria-hidden="true">10.</strong> Практика</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/01-sql-basics/practice/exercises/01-data-definition.html"><strong aria-hidden="true">10.1.</strong> Упражнения: DDL</a></li><li class="chapter-item "><a href="modules/01-sql-basics/practice/exercises/02-data-manipulation.html"><strong aria-hidden="true">10.2.</strong> Упражнения: DML и JOIN</a></li><li class="chapter-item "><a href="modules/01-sql-basics/practice/solutions/01-data-definition-solutions.html"><strong aria-hidden="true">10.3.</strong> Решения: DDL</a></li><li class="chapter-item "><a href="modules/01-sql-basics/practice/solutions/02-data-manipulation-solutions.html"><strong aria-hidden="true">10.4.</strong> Решения: DML и JOIN</a></li></ol></li><li class="chapter-item expanded "><a href="modules/01-sql-basics/project/index.html"><strong aria-hidden="true">11.</strong> Проект: Автосалон &quot;Врум-Бум&quot;</a></li><li class="chapter-item expanded "><a href="modules/02-advanced-sql/index.html"><strong aria-hidden="true">12.</strong> Обзор модуля</a></li><li class="chapter-item expanded "><a href="modules/02-advanced-sql/theory/index.html"><strong aria-hidden="true">13.</strong> Теория</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/02-advanced-sql/theory/01-subqueries-cte.html"><strong aria-hidden="true">13.1.</strong> Подзапросы и CTE</a></li><li class="chapter-item "><a href="modules/02-advanced-sql/theory/02-window-functions.html"><strong aria-hidden="true">13.2.</strong> Оконные функции</a></li><li class="chapter-item "><a href="modules/02-advanced-sql/theory/03-views.html"><strong aria-hidden="true">13.3.</strong> Представления</a></li><li class="chapter-item "><a href="modules/02-advanced-sql/theory/04-advanced-types.html"><strong aria-hidden="true">13.4.</strong> Продвинутые типы данных</a></li><li class="chapter-item "><a href="modules/02-advanced-sql/theory/05-geodata.html"><strong aria-hidden="true">13.5.</strong> Геоданные и PostGIS</a></li><li class="chapter-item "><a href="modules/02-advanced-sql/theory/06-transactions.html"><strong aria-hidden="true">13.6.</strong> Транзакции</a></li></ol></li><li class="chapter-item expanded "><a href="modules/02-advanced-sql/practice/index.html"><strong aria-hidden="true">14.</strong> Практика</a></li><li class="chapter-item expanded "><a href="modules/02-advanced-sql/project/index.html"><strong aria-hidden="true">15.</strong> Проект: GastroHub</a></li><li class="chapter-item expanded "><a href="modules/03-server-programming/index.html"><strong aria-hidden="true">16.</strong> Обзор модуля</a></li><li class="chapter-item expanded "><a href="modules/03-server-programming/theory/index.html"><strong aria-hidden="true">17.</strong> Теория</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/03-server-programming/theory/01-procedures-functions.html"><strong aria-hidden="true">17.1.</strong> Процедуры и функции</a></li><li class="chapter-item "><a href="modules/03-server-programming/theory/02-plpgsql.html"><strong aria-hidden="true">17.2.</strong> PL/pgSQL</a></li><li class="chapter-item "><a href="modules/03-server-programming/theory/03-triggers.html"><strong aria-hidden="true">17.3.</strong> Триггеры</a></li></ol></li><li class="chapter-item expanded "><a href="modules/03-server-programming/practice/index.html"><strong aria-hidden="true">18.</strong> Практика</a></li><li class="chapter-item expanded "><a href="modules/03-server-programming/project/index.html"><strong aria-hidden="true">19.</strong> Проект: Dream Big HR</a></li><li class="chapter-item expanded "><a href="modules/04-orm-optimization/index.html"><strong aria-hidden="true">20.</strong> Обзор модуля</a></li><li class="chapter-item expanded "><a href="modules/04-orm-optimization/theory/index.html"><strong aria-hidden="true">21.</strong> Теория</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="modules/04-orm-optimization/theory/01-orm-basics.html"><strong aria-hidden="true">21.1.</strong> Технология ORM</a></li><li class="chapter-item "><a href="modules/04-orm-optimization/theory/02-query-optimization.html"><strong aria-hidden="true">21.2.</strong> Оптимизация запросов</a></li><li class="chapter-item "><a href="modules/04-orm-optimization/theory/03-indexes.html"><strong aria-hidden="true">21.3.</strong> Индексы</a></li><li class="chapter-item "><a href="modules/04-orm-optimization/theory/04-execution-plans.html"><strong aria-hidden="true">21.4.</strong> Анализ планов выполнения</a></li></ol></li><li class="chapter-item expanded "><a href="modules/04-orm-optimization/practice/index.html"><strong aria-hidden="true">22.</strong> Практика</a></li><li class="chapter-item expanded "><a href="modules/04-orm-optimization/project/index.html"><strong aria-hidden="true">23.</strong> Проект: Оптимизация доставки</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Дополнительные материалы</li><li class="chapter-item expanded "><a href="reference/index.html"><strong aria-hidden="true">24.</strong> Справочник SQL</a></li><li class="chapter-item expanded "><a href="cheatsheets/index.html"><strong aria-hidden="true">25.</strong> Шпаргалки</a></li><li class="chapter-item expanded "><a href="examples/index.html"><strong aria-hidden="true">26.</strong> Примеры кода</a></li><li class="chapter-item expanded "><a href="faq.html"><strong aria-hidden="true">27.</strong> Часто задаваемые вопросы</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
