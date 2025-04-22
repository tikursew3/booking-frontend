package com.passion2code.booking.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StripeService {

    @Value("${FRONTEND_BASE_URL:http://localhost:3000}")
    private String frontendBaseUrl;
    /*
        This service will:

        Take booking/payment details
        Create a Stripe Checkout session
        Return the session URL so your frontend can redirect the customer to Stripe.
     */
    /*
        This method takes:
        bookingId (to store in Stripe metadata)
        amount (deposit amount or full amount)
        successUrl (where the customer is redirected after payment)
        cancelUrl (if they cancel)
        It returns a Stripe-hosted checkout page URL.
     */
    public String createCheckoutSession(Long bookingId, BigDecimal amount) throws StripeException {
        String successUrl = frontendBaseUrl + "/payment-success";
        String cancelUrl = frontendBaseUrl + "/payment-cancel";

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(amount.multiply(BigDecimal.valueOf(100)).longValue())  // convert dollars to cents
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Photography Booking #" + bookingId)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .setPaymentIntentData(
                        SessionCreateParams.PaymentIntentData.builder()
                                .putMetadata("bookingId", String.valueOf(bookingId))  // ✅ Add metadata to payment intent
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }
}
