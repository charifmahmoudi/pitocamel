/* Pi calculus grammar */
%{
      var agents = [
      {
            "type" : '',
            "name" : '',
            "inst" : []
      }
      ];
%}

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
[a-z]+[a-zA-Z0-9]*  { return 'VAR'; }
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
        { $$ = [$term]; }
  |  definition br term
        { $$ = $definition.concat($term); }
     ;
term
    : call def agent
        { $$ = { "type" : "term" , "sign" : $call, "core" : $agent}; }
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
      { $$ = { "type" : "agent", "name" : "simple", "params" : $prefix } ; }
    | agent '+' agent
      { $$ = { "type" : "agent", "name" : "+", "params" : [$agent1, $agent2] }; }
    | agent '|' agent
      { $$ = { "type" : "agent", "name" : "|", "params" : [$agent1, $agent2] }; }
    | '!' agent
      { $$ = { "type" : "agent", "name" : "!", "params" : $agent }; }
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
      { $$ =  { "type" : "process", "name" : $process, "params" : $param_list }; }
    | process
      { $$ = { "type" : "process", "name" : $process, "params" : [] }; }
    ;
prefix
  : prefix '.' alpha
      { $$ = $prefix.concat($alpha); }
  | alpha
        { $$ = $alpha; }
  ;
alpha
  : var '<' param_list '>'
      { $$ = [{ "type" : "varEM", "name" : $var, "params" : $param_list }]; }
  | var '(' param_list ')'
      { $$ = [{ "type" : "varRC", "name" : $var, "params" : $param_list }]; }
  | tau
      { $$ = [{"type" : "tau", "value" : $tau}]; }
  | call
      { $$ = [$call]; }
  | new
        { $$ = $new; }
    ;
new
    : '(' nu SEP var_sep_list ')' prefix
     { $$ = [{ "type" : "nu", "value" : $var_sep_list }].concat($prefix); }
   ;

var_list
  : var_list ',' var
    { $$ = $var_list.concat($var); }
  | var
    { $$ = [$var]; }
  ;

var_sep_list
  : var_sep_list SEP var
    { $$ = $var_sep_list.concat($var); }
  | var
    { $$ = [$var]; }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

process_list
  : process_list ',' call
       { $$ = $process_list.concat($call); }
  | call
      { $$ = [$call]; }
  ;

process
  : PROC
    { $$ = yytext; }
  ;

param_list
  : param_list ',' param
       { $$ = $param_list.concat($param) ; }
  | param
      { $$ = [$param]; }
  ;

param
  : call
   { $$ = $call; }
  | var
      { $$ = $var; }
  ;

