package com.kitchengarden.api.graphql;

import com.kitchengarden.api.nutrition.CaloriesService;
import com.kitchengarden.api.product.Product;
import com.kitchengarden.api.product.ProductRepository;
import com.kitchengarden.api.security.AuthUtil;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@GraphQLApi
@Component
public class  KitchenGardenGraphQL {

    private final ProductRepository productRepository;
    private final AuthUtil authUtil;
    private final CaloriesService caloriesService;

    public KitchenGardenGraphQL(ProductRepository productRepository, AuthUtil authUtil, CaloriesService caloriesService) {
        this.productRepository = productRepository;
        this.authUtil = authUtil;
        this.caloriesService = caloriesService;
    }

    // ----- Buyer -----
    @GraphQLQuery(name = "products")
    public List<Product> products() {
        return productRepository.findAll();
    }

    @GraphQLQuery(name = "caloriesEstimate")
    public CaloriesService.CaloriesEstimate caloriesEstimate(@GraphQLArgument(name = "productName") String productName,
                                                             @GraphQLArgument(name = "quantity") int quantity) {
        return caloriesService.estimate(productName, quantity);
    }

    // ----- Seller -----
    @GraphQLQuery(name = "myProducts")
    public List<Product> myProducts(Authentication auth) {
        String userId = authUtil.requireUserId(auth);
        return productRepository.findBySellerUserIdOrderByCreatedAtDesc(userId);
    }

    @GraphQLMutation(name = "createProduct")
    public Product createProduct(Authentication auth, String name, double price, int quantityAvailable, String imageUrl) {
        String userId = authUtil.requireUserId(auth);
        Product p = new Product(userId, name, price, quantityAvailable, imageUrl);
        return productRepository.save(p);
    }

    @GraphQLMutation(name = "updateQuantity")
    public Product updateQuantity(Authentication auth, long productId, int quantityAvailable) {
        String userId = authUtil.requireUserId(auth);
        Product p = productRepository.findById(productId).orElseThrow();
        if (!userId.equals(p.getSellerUserId())) {
            throw new IllegalStateException("Not your product");
        }
        p.setQuantityAvailable(quantityAvailable);
        return productRepository.save(p);
    }
}
