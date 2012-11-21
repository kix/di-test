Тестовое задание для «Цифровой механики»
========================================
Нужно разработать приложение на базе HTML5/JavaScript/NodeJS/MongoDB
со следующим функционалом:

- Веб-страница, состоящая из двух частей: 
	- таблицы созданных объектов **✓**
	- и формы для добавления новых объектов **✓**
- Поля данных объекта:
	- название (строка), **✓**
	- количество (целое число), **✓**
	- цена (число с плавающей запятой, до двух цифр после запятой), **✓**
	- сумма (число с плавающей запятой, до двух цифр после запятой). **✓**
- Сумма по каждому объекту рассчитывается автоматически в зависимости 
количества и цены. **✓**

Будет хорошо, если:

- В форме есть [контроль типов](http://github.com/kix/di-test/tree/master/models.js#l11) введенных данных с выдачей сообщения
об ошибке в случае наличия проблем. **✓**
- Форма может быть использована не только для добавления объектов,
но и для их редактирования **✓**
- В решении задачи использованы:
	- AJAX**✓**, 
	- Twitter Bootstrap**✓**, 
	- KnockoutJS**±**

Срок выполнения задачи - три дня с момента получения письма.

Мои примечания
--------------

- Конфигурация — в файле [```config.json```](http://github.com/kix/di-test/tree/master/config.json), по умолчанию предусматривает локальный Mongo на стандартном порту  27017. HTTP-сервер слушает порт 3000.
- Mongorito — приятный ODM, ему не хватает только нормальной обработки ошибок подключения.
- Knockout разочаровал. Очень странно реализованы многие вещи, как то:
	- По логике, методы ```ViewModel``` вообще не должны использовать никакого jQuery, но получается так, что удобнее написать две строчки jQ, чем привязывать свойства к моделям (хотя в случае, например, формы редактирования/добавления некоего итема это было бы удобно и упростило бы валидацию и подобное).

	
Что можно было бы приделать, чтобы стало совсем круто:

- Хранить сделанные изменения в ```localStorage``` на клиенте в виде Unit of Work и синхронизовать не при каждом изменении, а тогда, когда это удобно.
- Написать или найти обертку вокруг RESTful (правильного RESTful с корректными УРЛами и методами) и либо связать ее с KO/другим frontend-MVC-фреймворком, либо вообще реализовать все это самостоятельно