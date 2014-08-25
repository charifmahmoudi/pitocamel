/* Pi calculus grammar */

%lex
%%

\s*\n\s*  {/* ignore */}
\s?"+"\s?       { return '+'; }
\s?"|"\s?       { return '|'; }
\s?"!"\s?       { return '!'; }
\s?"("\s?       { return '('; }
\s?")"\s?       { return ')'; }
\s?"≝"\s?       { return 'DEF'; }
"&lt;"\s?       { return '<'; }
\s?"&gt;"       { return '>'; }
"τ"       { return 'TAU'; }
"ν"       { return 'NU'; }
"."    { return '.'; }
","\s?    { return ','; }
[a-z]+[a-zA-Z0-9]*\s?  { return 'VAR'; }
[A-Z]+[a-zA-Z0-9]*\s?  { return 'PROC'; }
\s+       { return 'SEP'; }
\s?"<br>"\s?       { return 'BR'; }
<<EOF>>   { return 'EOF'; }
/lex

%start calculus

%right DEF
%left '|'
%left '+'
%left '.'
%left '!'
%left SEP

%%

calculus
  : definition EOF
      { return $definition; }
    ;
definition
  : term
        { return $term; }
  |  term br term
        { return $term1 + $br + $term2; }
     ;
term
    : call def agent
        { $$ = $call + $def + $agent }
    ;
br
  : BR
    { $$ = yytext; }
  ;
def
  : DEF
    { $$ = yytext; }
  ;


agent
  :prefix
      { $$ = $prefix ; }
    | agent '+' agent
      { $$ = $agent1 + '+' + $agent2; }
    | agent '|' agent
      { $$ = $agent1 + '|' + $agent2; }
    | '!' agent
      { $$ = '!' + $agent; }
    ;
tau
  : TAU
    { $$ = yytext; }
  ;

nu
  : NU
    { $$ = yytext; }
  ;


call
  : process '(' param_list ')'
      { $$ = $process + '(' + $param_list + ')'; }
    | process
      { $$ = $process ; }
    ;
prefix
  : prefix '.' alpha
      { $$ = $prefix + '.' + $alpha; }
  | alpha
        { $$ = $alpha; }
  ;
alpha
  : var '<' param_list '>'
      { $$ = $var1 + "<" + $param_list + ">"; }
  | var '(' param_list ')'
      { $$ = $var1 + '(' + $param_list + ')'; }
  | tau
      { $$ = 'TAU'; }
  | call
      { $$ = $call; }
  | new
        { $$ = $new ; }
    ;
new
    : '(' nu SEP var_sep_list ')' prefix
     { $$ = '(' + $nu + ' ' + $var_sep_list + ')' + ' ' + $prefix; }
   ;

var_list
  : var_list ',' var
    { $$ = $var_list + ',' + $var; }
  | var
    { $$ = [$var]; }
  ;

var_sep_list
  : var_sep_list SEP var
    { $$ = $var_sep_list + ' ' + $var; }
  | var
    { $$ = [$var]; }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

process_list
  : process_list ',' call
       { $$ = $process_list + ',' + $call; }
  | call
      { $$ = $call; }
  ;

process
  : PROC
    { $$ = yytext; }
  ;

param_list
  : param_list ',' param
       { $$ = $param_list + ',' + $param; }
  | param
      { $$ = $param; }
  ;

param
  : call
   { $$ = $call; }
  | var
      { $$ = $var; }
  ;

