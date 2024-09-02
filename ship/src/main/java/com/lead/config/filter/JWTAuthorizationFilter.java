package com.lead.config.filter;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import com.lead.entity.Member;
import com.lead.repository.MemberRepo;

@RequiredArgsConstructor
public class JWTAuthorizationFilter extends OncePerRequestFilter {

    private final MemberRepo memRepo;

protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
		
		String srcToken = req.getHeader("Authorization");
		if(srcToken == null || !srcToken.startsWith("Bearer ")) {
			chain.doFilter(req, res);
			return;
		}
		String jwtToken = srcToken.replace("Bearer ", "");
		
		String username = JWT.require(Algorithm.HMAC256("com.lead.jwt")).build().verify(jwtToken).getClaim("username").asString();
		Optional<Member> opt = memRepo.findById(username);
		if(!opt.isPresent()) {
			chain.doFilter(req, res);
			return;
		}
		Member findmem = opt.get();
		
		User user = new User(findmem.getUsername(),findmem.getPw(), AuthorityUtils.createAuthorityList(findmem.getRole().toString()));
		
		Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		chain.doFilter(req, res);
	}
}
