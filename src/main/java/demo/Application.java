package demo;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

@Configuration
@ComponentScan
@EnableAutoConfiguration
public class Application {

//    @Bean
//    public ClassLoaderTemplateResolver classLoaderTemplateResolver() {
//        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
//        resolver.setPrefix("themplates/");
//        resolver.setSuffix(".html");
//        resolver.setTemplateMode("HTML5");
//        resolver.setCharacterEncoding("UTF-8");
//        resolver.setCacheable(false);
//        return resolver;
//    }
//
//    @Bean
//    public ServletContextTemplateResolver servletContextTemplateResolver() {
//        ServletContextTemplateResolver resolver = new ServletContextTemplateResolver();
//        resolver.setPrefix("/WEB-INF/views/");
//        resolver.setSuffix(".html");
//        resolver.setTemplateMode("HTML5");
//        resolver.setCharacterEncoding("UTF-8");
//        resolver.setCacheable(false);
//        return resolver;
//    }
//
//    @Bean
//    public SpringTemplateEngine templateEngine() {
//        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
//        Set<ITemplateResolver> resolvers = new HashSet<ITemplateResolver>();
//        resolvers.add(classLoaderTemplateResolver());
//        resolvers.add(servletContextTemplateResolver());
//        templateEngine.setTemplateResolvers(resolvers);
//        return templateEngine;
//    }
//
//    @Bean
//    public ThymeleafViewResolver thymeleafViewResolver() {
//        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
//        resolver.setTemplateEngine(templateEngine());
//        resolver.setOrder(1);
//        resolver.setCharacterEncoding("UTF-8");
//        return resolver;
//    }
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
class Controller {
	@RequestMapping(value="/")
	public ModelAndView index() {
		return new ModelAndView("index");
	}
}
