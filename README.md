<a href="https://hits.seeyoufarm.com"/><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/devfancy/devfancy.github.io"/></a>                        

> 📌 The template is based on the [Github Blog Template](https://github.com/Gaohaoyang/gaohaoyang.github.io) created by [HyG](https://github.com/gaohaoyang).

For the Korean version of the template, I referred to the [Github Blog Template](https://github.com/goodGid/goodGid.github.io) by [Gid](https://github.com/goodGid).

### Writing Commit Messages

* When **creating a new post** for the first time, write the commit message as `Write {Category} Post " {Title} "`.

  * Example: If the category is `DevHistory` and the title is "2024 Dev History",

  * the commit message should be written as `Write DevHistory Post " 2024 Dev History "`.

* If you are **updating an existing post**, write the commit message as `Update {Category} Post " {Title}`.

### How to Add or Modify Categories

> Unlike the original template, which generates category order randomly, I have opted for a manual addition/modification approach.

* Add the desired categories to the `categories_order` section in the `_config.yml` file.

* As of (2024.12.22), the **current setup** is as follows:

```yaml
categories_order:
  - "DevHistory"
  - "TechInsight"
  - "Java"
  - "Spring"
  - "SpringBoot"
  - "JPA"
  - "MySQL"
  - "Flyway"
  - "Technology"
  # More categories...
```