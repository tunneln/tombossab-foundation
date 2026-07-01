package org.tombossabfoundation.backend.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * Pure unit test — the JavaMailSender is mocked, so no SMTP connection is made.
 * Verifies how EmailService assembles the outgoing message from its arguments.
 */
@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void sendSimpleEmail_buildsMessageFromArgumentsAndSends() {
        emailService.sendSimpleEmail("dest@example.com", "Hello", "Body text");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();

        assertArrayEquals(new String[] {"dest@example.com"}, sent.getTo(), "recipient");
        assertEquals("Hello", sent.getSubject(), "subject");
        assertEquals("Body text", sent.getText(), "body");

        // Pinned behaviour, not an endorsement: the service sets From == To. That
        // works for the only current caller (the newsletter form emails the site's
        // own address and puts the subscriber in the body), but it is brittle if
        // this method is ever reused to email a real end user. This assertion makes
        // any change to that From handling a deliberate, visible decision.
        assertEquals("dest@example.com", sent.getFrom(), "from currently mirrors to");
    }
}
