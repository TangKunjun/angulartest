#国际化处理

可以利用以下第三方库，快速支持国际化：

- ngx-translate/core
- ngx-translate/http-loader
- ngx-translate-extract

**安装**
```
npm install @ngx-translate/core @ngx-translate/http-loader --save
npm install @biesbjerg/ngx-translate-extract --save-dev
```

**引入AppModule**
```
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
```

**AppComponent初始化**
```
constructor(translate: TranslateService) {
    translate.setDefaultLang("zh-cn");
    translate.use("en")
  }
```
**使用**
```
<p>{{"home" | translate}}</p>
```
然后在assets文件夹创建i18n文件夹在里面放入对应语言文件就行了；
还也可以通过使用ngx-translate-extract来创建文件

#ngx-translate-extract 应用
使用 ngx-translate-extract 这个库实现自动抽取模板中使用 TranslatePipe 转换的键。为了方便后续操作，我们可以定义一个 npm script：
```
"extract": "ngx-translate-extract --input ./src/app --output ./src/assets/i18n/{zh-cn,zh-hk,en}.json --sort --format namespaced-json --format-indentation ' '",
```
上述 ngx-translate-extract 命令中所使用的参数：

- input：抽取字符串的目录；
- output：抽取结果的输出目录；
- sort：保存输出文件时， 按照字母顺序对键进行排序；
- format：指定输出的文件格式，支持 json、namespaced-json 及 pot，默认为 json；
- format-indentation：设置输出的缩进格式，默认为 \t

在定义完 extract 脚本之后，我们可以运行下面的命令执行自动抽取任务：
  ```
  npm run extract
```
命令成功执行后，在 src/assets 目录下会生成 3 个 JSON 文件：
